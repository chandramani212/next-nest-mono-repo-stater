import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';

describe('LinksController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /links creates a link from a valid body', () => {
    return request(app.getHttpServer())
      .post('/links')
      .send({ title: 'Ok', url: 'https://ok.com', description: 'valid' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: 3, title: 'Ok' });
      });
  });

  it('POST /links rejects an invalid url', () => {
    return request(app.getHttpServer())
      .post('/links')
      .send({ title: 'Ok', url: 'not-a-url', description: 'valid' })
      .expect(400);
  });

  it('POST /links rejects unknown properties', () => {
    return request(app.getHttpServer())
      .post('/links')
      .send({
        title: 'Ok',
        url: 'https://ok.com',
        description: 'valid',
        extra: true,
      })
      .expect(400);
  });

  it('PATCH /links/:id updates a single field', () => {
    return request(app.getHttpServer())
      .patch('/links/0')
      .send({ title: 'Renamed' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ id: 0, title: 'Renamed' });
      });
  });
});
