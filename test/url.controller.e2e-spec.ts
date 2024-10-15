import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UrlController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/url/shorten (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/url/shorten')
            .send({ url: 'https://exemplo.com' })
            .expect(201);

        expect(response.body).toHaveProperty('shortUrl');
        expect(response.body.shortUrl).toMatch(/http:\/\/(localhost|127\.0\.0\.1):\d+\/url\/\w+/);
    });

    it('/url/:code (GET)', async () => {
        const shortenResponse = await request(app.getHttpServer())
            .post('/url/shorten')
            .send({ url: 'https://exemplo.com' })
            .expect(201);

        const shortUrl = shortenResponse.body.shortUrl;
        const shortCode = shortUrl.split('/').pop();

        const response = await request(app.getHttpServer())
            .get(`/url/${shortCode}`)
            .expect(302);

        expect(response.headers.location).toBe('https://exemplo.com');
    });
});
