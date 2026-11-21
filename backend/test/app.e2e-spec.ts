import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
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
  const appDatabaseUrl = process.env.DATABASE_URL;
  beforeAll(async () => {
    const testDatabaseUrl = process.env.TEST_DATABASE_URL;
    if (!testDatabaseUrl || testDatabaseUrl === appDatabaseUrl) {
      throw new Error(
        'TEST_DATABASE_URL harus menunjuk ke database tes terpisah yang sudah dimigrasi.',
      );
    }
    process.env.DATABASE_URL = testDatabaseUrl;
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
  });
  afterAll(async () => {
    try {
      if (prisma) {
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
    }
  });

  it('GET daftar dan detail awal', async () => {
    const list = await request(app.getHttpServer())
      .get('/api/skills')
      .expect(200);
    expect(list.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 1 })]),
    );
    await request(app.getHttpServer())
      .get('/api/skills/1')
      .expect(200)
      .expect(({ body }: { body: { id: number } }) => {
        expect(body.id).toBe(1);
      });
  });

  it('POST, PATCH, DELETE dan verifikasi data benar-benar berubah', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/skills')
      .send(valid)
      .expect(201);
    const id = (created.body as { id: number }).id;
    const path = '/api/skills/' + id;
    await request(app.getHttpServer())
      .patch(path)
      .send({ name: updatedName, favs: 12 })
      .expect(200);
    const detail = await request(app.getHttpServer()).get(path).expect(200);
    expect(detail.body).toMatchObject({
      name: updatedName,
      favs: 12,
      description: valid.description,
    });
    await request(app.getHttpServer()).delete(path).expect(200);
    await request(app.getHttpServer()).get(path).expect(404);
    const next = await request(app.getHttpServer())
      .post('/api/skills')
      .send(valid)
      .expect(201);
    expect((next.body as { id: number }).id).toBeGreaterThan(id);
  });

  it('404 untuk GET, PATCH, DELETE ID yang tidak ada', async () => {
    await request(app.getHttpServer()).get('/api/skills/999').expect(404);
    await request(app.getHttpServer())
      .patch('/api/skills/999')
      .send({ favs: 1 })
      .expect(404);
    await request(app.getHttpServer()).delete('/api/skills/999').expect(404);
  });

  it('409 duplikat POST dan PATCH, tidak peka kapital/spasi', async () => {
    await request(app.getHttpServer())
      .post('/api/skills')
      .send({ ...valid, name: ' ui/ux designer assistant ' })
      .expect(409);
    await request(app.getHttpServer())
      .patch('/api/skills/2')
      .send({ name: 'UI/UX Designer Assistant' })
      .expect(409);
    await request(app.getHttpServer())
      .patch('/api/skills/1')
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
      .send({ ...valid, ...invalid })
      .expect(400);
  });

  it('400 untuk field wajib hilang dan ID bukan integer', async () => {
    await request(app.getHttpServer()).post('/api/skills').send({}).expect(400);
    await request(app.getHttpServer()).get('/api/skills/abc').expect(400);
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
      .send(invalid)
      .expect(400);
  });
});
