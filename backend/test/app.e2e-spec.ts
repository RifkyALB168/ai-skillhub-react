import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Skills API', () => {
  let app: INestApplication<App>;
  const valid = {
    name: 'Code Review Helper',
    description: 'Meninjau kode dan memberi saran perbaikan.',
    category: 'Automation',
    platform: 'Claude',
    author: '@rifky',
    favs: 0,
  };
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
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
  afterEach(async () => {
    await app.close();
  });

  it('GET daftar dan detail awal', async () => {
    const list = await request(app.getHttpServer())
      .get('/api/skills')
      .expect(200);
    expect(list.body).toHaveLength(4);
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
    expect(id).toBe(5);
    await request(app.getHttpServer())
      .patch('/api/skills/5')
      .send({ name: 'Code Review Updated', favs: 12 })
      .expect(200);
    const detail = await request(app.getHttpServer())
      .get('/api/skills/5')
      .expect(200);
    expect(detail.body).toMatchObject({
      name: 'Code Review Updated',
      favs: 12,
      description: valid.description,
    });
    await request(app.getHttpServer()).delete('/api/skills/5').expect(200);
    await request(app.getHttpServer()).get('/api/skills/5').expect(404);
    const next = await request(app.getHttpServer())
      .post('/api/skills')
      .send(valid)
      .expect(201);
    expect((next.body as { id: number }).id).toBe(6);
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
    { category: 'Unknown' },
    { extra: true },
  ])('400 PATCH invalid: %j', async (invalid) => {
    await request(app.getHttpServer())
      .patch('/api/skills/1')
      .send(invalid)
      .expect(400);
  });
});
