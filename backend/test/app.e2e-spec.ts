import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../src/prisma/prisma.service';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Skills API', () => {
  let app: INestApplication<App>;
  const suffix = randomUUID().slice(0, 8);
  const updatedName = 'Code Review Updated ' + suffix;
  const valid = {
    name: 'Code Review Helper ' + suffix,
    description: 'Meninjau kode dan memberi saran perbaikan.',
    category: 'Automation',
    platform: 'Claude',
    author: '@rifky',
    favs: 0,
  };
  let prisma: PrismaService;
  let accessToken: string;
  let testUserId: number;
  const credentials = {
    email: 'skillhub-' + suffix + '@example.test',
    password: 'Test-only!42-' + suffix,
  };
  const appDatabaseUrl = process.env.DATABASE_URL;
  const appJwtSecret = process.env.JWT_SECRET;
  beforeAll(async () => {
    const testDatabaseUrl = process.env.TEST_DATABASE_URL;
    if (!testDatabaseUrl || testDatabaseUrl === appDatabaseUrl) {
      throw new Error(
        'TEST_DATABASE_URL harus menunjuk ke database tes terpisah yang sudah dimigrasi.',
      );
    }
    process.env.DATABASE_URL = testDatabaseUrl;
    process.env.JWT_SECRET = randomUUID() + randomUUID();
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    prisma = module.get(PrismaService);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    const registration = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(credentials)
      .expect(201);
    const account = registration.body as { id: number; email: string };
    testUserId = account.id;
    expect(registration.body).toEqual({
      id: testUserId,
      email: credentials.email,
    });

    const session = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);
    accessToken = (session.body as { accessToken: string }).accessToken;
    expect(accessToken.split('.')).toHaveLength(3);
  });
  afterAll(async () => {
    try {
      if (prisma) {
        if (testUserId) await prisma.user.delete({ where: { id: testUserId } });
        await prisma.skill.deleteMany({
          where: {
            normalizedName: {
              in: [valid.name.toLowerCase(), updatedName.toLowerCase()],
            },
          },
        });
      }
    } finally {
      if (app) await app.close();
      if (appDatabaseUrl === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = appDatabaseUrl;
      if (appJwtSecret === undefined) delete process.env.JWT_SECRET;
      else process.env.JWT_SECRET = appJwtSecret;
    }
  });

  it('registrasi menyimpan hash bcrypt yang cocok dengan kata sandi', async () => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: testUserId },
    });
    expect(user.passwordHash).toMatch(/^\$2[aby]\$12\$/);
    expect(await compare(credentials.password, user.passwordHash)).toBe(true);
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ ...credentials, email: credentials.email.toUpperCase() })
      .expect(409);
  });

  it('login menolak kata sandi salah', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ ...credentials, password: 'incorrect-password-123' })
      .expect(401);
  });

  it('endpoint privat menolak token kosong, tidak valid dan kedaluwarsa', async () => {
    await request(app.getHttpServer()).get('/api/skills').expect(401);
    await request(app.getHttpServer())
      .post('/api/skills')
      .send(valid)
      .expect(401);
    await request(app.getHttpServer())
      .patch('/api/skills/1')
      .send({ favs: 0 })
      .expect(401);
    await request(app.getHttpServer()).delete('/api/skills/1').expect(401);
    await request(app.getHttpServer())
      .get('/api/skills')
      .set('Authorization', 'Bearer not-a-token')
      .expect(401);
    const expired = await app
      .get(JwtService)
      .signAsync({ sub: testUserId }, { expiresIn: -1 });
    await request(app.getHttpServer())
      .get('/api/skills')
      .set('Authorization', 'Bearer ' + expired)
      .expect(401);
  });

  it('GET daftar dan detail awal', async () => {
    const list = await request(app.getHttpServer())
      .get('/api/skills')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
    expect(list.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 1 })]),
    );
    await request(app.getHttpServer())
      .get('/api/skills/1')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .expect(({ body }: { body: { id: number } }) => {
        expect(body.id).toBe(1);
      });
  });

  it('POST, PATCH, DELETE dan verifikasi data benar-benar berubah', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/skills')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(valid)
      .expect(201);
    const id = (created.body as { id: number }).id;
    const path = '/api/skills/' + id;
    await request(app.getHttpServer())
      .patch(path)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ name: updatedName, favs: 12 })
      .expect(200);
    const detail = await request(app.getHttpServer())
      .get(path)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
    expect(detail.body).toMatchObject({
      name: updatedName,
      favs: 12,
      description: valid.description,
    });
    await request(app.getHttpServer())
      .delete(path)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
    await request(app.getHttpServer())
      .get(path)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(404);
    const next = await request(app.getHttpServer())
      .post('/api/skills')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(valid)
      .expect(201);
    expect((next.body as { id: number }).id).toBeGreaterThan(id);
  });

  it('404 untuk GET, PATCH, DELETE ID yang tidak ada', async () => {
    await request(app.getHttpServer())
      .get('/api/skills/999')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(404);
    await request(app.getHttpServer())
      .patch('/api/skills/999')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ favs: 1 })
      .expect(404);
    await request(app.getHttpServer())
      .delete('/api/skills/999')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(404);
  });

  it('409 duplikat POST dan PATCH, tidak peka kapital/spasi', async () => {
    await request(app.getHttpServer())
      .post('/api/skills')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...valid, name: ' ui/ux designer assistant ' })
      .expect(409);
    await request(app.getHttpServer())
      .patch('/api/skills/2')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ name: 'UI/UX Designer Assistant' })
      .expect(409);
    await request(app.getHttpServer())
      .patch('/api/skills/1')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ name: 'UI/UX Designer Assistant' })
      .expect(200);
  });

  it.each([
    { name: 'x' },
    { name: '   ' },
    { name: 7 },
    { description: 'pendek' },
    { category: 'Unknown' },
    { platform: 'Unknown' },
    { author: '' },
    { favs: -1 },
    { favs: 2_147_483_648 },
    { favs: 1.5 },
    { favs: '2' },
    { favs: null },
    { extra: true },
  ])('400 POST payload tidak valid: %j', async (invalid) => {
    await request(app.getHttpServer())
      .post('/api/skills')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...valid, ...invalid })
      .expect(400);
  });

  it('400 untuk field wajib hilang dan ID bukan integer', async () => {
    await request(app.getHttpServer())
      .post('/api/skills')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({})
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/skills/abc')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(400);
  });

  it.each([
    { name: null },
    { favs: -1 },
    { favs: 2_147_483_648 },
    { category: 'Unknown' },
    { extra: true },
  ])('400 PATCH invalid: %j', async (invalid) => {
    await request(app.getHttpServer())
      .patch('/api/skills/1')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(invalid)
      .expect(400);
  });
});
