import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersQueryRepository } from '../../src/features/super-admin/users/infrastructure/users.query.repository';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-setting';

const initTestSettings = async (): Promise<{ app: INestApplication }> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(UsersQueryRepository)
    .useValue({ getAll: () => true })
    .compile();

  const app = moduleFixture.createNestApplication();
  applyAppSettings(app);
  await app.init();

  return {
    app,
  };
};

describe('Users - /users (e2e)', () => {
  const users = {
    id: 1,
    firstName: 'FirstName #1',
    lastName: 'LastName #1',
    isActive: true,
  };

  let app: INestApplication;
  //let blogs = []

  beforeAll(async () => {
    const testSettings = await initTestSettings();
    app = testSettings.app;
    //blog = manager.create10Blogs()
  });

  it('Create [POST /users]', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(users)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(users);
      });
  });

  it('Get all users [GET /users]', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('Get one user [GET /users/:id]', () => {
    return request(app.getHttpServer())
      .get('/users/2')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('Delete one user [DELETE /users/:id]', () => {
    return request(app.getHttpServer()).delete('/users/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
