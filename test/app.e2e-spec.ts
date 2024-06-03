import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { applyAppSettings } from '../src/settings/apply-app-setting';
import { HTTP_STATUSES } from './types/types';
import { UsersRepository } from '../src/features/super-admin/users/infrastructure/users.repository';
import { BlogsRepository } from '../src/features/super-admin/blogs/infrastructure/blogs.repository';
import { DeviceRepository } from '../src/features/public/devices/infrastructure/device.repository';
import { PostsRepository } from '../src/features/public/posts/infrastructure/posts.repository';
import { CommentsRepository } from '../src/features/public/comments/infrastructure/comments.repository';
import { JwtService } from '../src/features/public/auth/application/jwt.service';

describe('AppController (e2e) ff', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let blogsRepository: BlogsRepository;
  let devicesRepository: DeviceRepository;
  let jwtService: JwtService;
  let postsRepository: PostsRepository;
  let commentsRepository: CommentsRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Применяем все настройки приложения (pipes, guards, filters, ...)
    applyAppSettings(app);
    await app.init();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    blogsRepository = moduleFixture.get<BlogsRepository>(BlogsRepository);
    devicesRepository = moduleFixture.get<DeviceRepository>(DeviceRepository);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    postsRepository = moduleFixture.get<PostsRepository>(PostsRepository);
    commentsRepository =
      moduleFixture.get<CommentsRepository>(CommentsRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('CLEAR ALL DATE', () => {
    it('should clear all date', async () => {
      await request(app.getHttpServer())
        .delete('/testing/all-data')
        .expect(HTTP_STATUSES.NO_CONTENT_204);
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  // it('should create new comment from correct input data', async () => {
  //   const usersRepository = app.get<UsersRepository>(UsersRepository);
  //   const postsRepository = app.get<PostsRepository>(PostsRepository);
  //   const devicesRepository = app.get<DeviceRepository>(DeviceRepository);
  //   const jwtService = app.get<JwtService>(JwtService);
  //   const foundUser = await usersRepository.findUserByLogin('Leha');
  //   const device = await devicesRepository.findDeviceTestByUserId(
  //     foundUser!._id.toString(),
  //   );
  //   const accessTokenByUserId = await jwtService.createAccessJWT(device!._id);
  //   // const userId = foundUser!._id.toString()
  //   // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
  //   const foundPost = await postsRepository.findPostByTitle('new title post');
  //   const res_ = await request(app)
  //     .post(`/posts/${foundPost!._id}/comments`)
  //     .set('Authorization', `Bearer ${accessTokenByUserId}`)
  //     .send({
  //       content: 'content for new comment',
  //     })
  //     .expect(HTTP_STATUSES.CREATED_201);
  //   expect({
  //     id: expect(res_.body.id).toEqual(expect.any(String)),
  //     content: expect(res_.body.content).toEqual('content for new comment'),
  //     commentatorInfo: {
  //       userId: expect(res_.body.commentatorInfo.userId).toEqual(
  //         foundUser!._id.toString(),
  //       ),
  //       userLogin: expect(res_.body.commentatorInfo.userLogin).toEqual('Leha'),
  //     },
  //     createdAt: expect(res_.body.createdAt).toEqual(expect.any(String)),
  //     likesInfo: {
  //       likesCount: expect(res_.body.likesInfo.likesCount).toEqual(0),
  //       dislikesCount: expect(res_.body.likesInfo.dislikesCount).toEqual(0),
  //       myStatus: expect(res_.body.likesInfo.myStatus).toEqual('None'),
  //     },
  //   });
  // });
  describe('GET blogs', () => {
    it('+ GET blogs', async () => {
      const res_ = await request(app.getHttpServer())
        .get('/blogs')
        .expect(HTTP_STATUSES.OK_200);
      expect(res_.body.items.length).toBe(0);
    });
  });
  // const loginUser = async (): Promise<{ accessToken: string }> => {
  //   const response = await request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send({
  //       loginOrEmail: 'Leha',
  //       password: 'string',
  //     });
  //
  //   return response.body;
  // };
  // const loginAdmin = async (): Promise<{ accessToken: string }> => {
  //   const response = await request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send({
  //       loginOrEmail: 'admin',
  //       password: 'string',
  //     });
  //
  //   return response.body;
  // };

  describe('/auth', () => {
    // let token;
    // beforeAll(async () => {
    //   token = await loginUser();
    //   //clear All data
    // });
    // // const usersRepository = app.get<UsersRepository>(UsersRepository);
    // // const blogsRepository = app.get<BlogsRepository>(BlogsRepository);
    // const devicesRepository = app.get<DeviceRepository>(DeviceRepository);
    // const jwtService = app.get<JwtService>(JwtService);
    it(`should\'nt create user with incorrect's input data`, async () => {
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          logi: 'leha',
          passord: 'string',
          emal: 'shtucer33@gmail.com',
        })
        .expect(HTTP_STATUSES.BAD_REQUEST_400)
        .expect({
          errorsMessages: [
            {
              message: 'login should not be empty',
              field: 'login',
            },
            {
              message: 'password should not be empty',
              field: 'password',
            },
            {
              message: 'email should not be empty',
              field: 'email',
            },
          ],
        });
    });

    it(`should\'nt create user with incorrect input data`, async () => {
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: 'leha',
          password: 'string',
          email: '123',
        })
        .expect(HTTP_STATUSES.BAD_REQUEST_400)
        .expect({
          errorsMessages: [
            {
              message:
                'email must match /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/ regular expression',
              field: 'email',
            },
          ],
        });
    });

    it('should create new user', async () => {
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: 'Leha',
          password: 'string',
          email: 'shtucer31@gmail.com',
        })
        .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

    it('should create new user by admin', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set(
          'Authorization',
          'Basic ' + Buffer.from('admin:qwerty').toString('base64'),
        )
        .send({
          login: 'admin',
          password: 'qwerty',
          email: 'shtucer34@gmail.com',
        });
      expect(HTTP_STATUSES.CREATED_201);
    });

    it('should return all users', async () => {
      const _res = await request(app.getHttpServer())
        .get('/users')
        .auth('admin', 'qwerty')
        .expect(HTTP_STATUSES.OK_200);
      expect(_res.body.items.length).toBe(2);
      // .expect("hello world")
    });

    it('should check code from email and confirm user', async () => {
      const foundUser = await usersRepository.findUserByLogin('Leha');

      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: foundUser!.emailConfirmation.confirmationCode,
        })
        .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

    it('should login and return accessToken from correct input date', async () => {
      // const foundUser = await usersRepository.findUserByLoginOrEmail('Leha');
      // const device = await devicesRepository.findDeviceTestByUserId(
      //   foundUser!._id.toString(),
      // );
      // console.log('device = ', device);
      // const accessTokenByUserId = await jwtService.createAccessJWT(device!._id);
      // const userId = user!._id.toString()
      // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .set('user-agent', 'asd')
        .send({ loginOrEmail: 'admin', password: 'qwerty' });
      expect(loginResponse.status).toBe(HTTP_STATUSES.OK_200);
      expect(loginResponse.body).toEqual({ accessToken: expect.any(String) });

      // const firstAccessToken = loginResponse.body;
      // await request(app.getHttpServer())
      //   .post('/auth/login')
      //   .send({
      //     loginOrEmail: 'Leha',
      //     password: 'string',
      //   });
      //   expect(loginResponse.status).toBe;
      //.expect({ accessToken: `${accessTokenByUserId}` });
    });

    it('should generate new pair of access and refresh tokens, and return new access token', async () => {
      const foundUser = await usersRepository.findUserByLoginOrEmail('Leha');
      const device = await devicesRepository.findDeviceTestByUserId(
        foundUser!.id,
      );

      const refreshTokenByDeviceId = await jwtService.createRefreshJWT(
        device!.id,
      );
      // const deviceId = device!._id.toString()
      // const refreshTokenByDeviceId = await jwt.sign({deviceId}, settings.JWT_SECRET, {expiresIn: '1200000'})

      const accessTokenByUserId = await jwtService.createAccessJWT(device!.id);
      // const userId = foundUser!._id.toString()
      // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})

      await request(app)
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${accessTokenByUserId}`)
        .set('Cookie', `refreshToken=${refreshTokenByDeviceId}`)

        .expect(HTTP_STATUSES.OK_200);
    });

    it('should return my date from new accessToken info', async () => {
      const foundUser = await usersRepository.findUserByLoginOrEmail('Leha');
      const device = await devicesRepository.findDeviceTestByUserId(
        foundUser!.id,
      );
      const accessTokenByUserId = await jwtService.createAccessJWT(device!.id);
      // const userId = foundUser!._id.toString()
      // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})

      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessTokenByUserId}`)

        .expect(HTTP_STATUSES.OK_200)
        .expect({
          email: 'shtucer31@gmail.com',
          login: 'Leha',
          userId: `${foundUser?.id}`,
        });
    });
  });

  describe('/blogs', () => {
    // const blogsRepository = app.get<BlogsRepository>(BlogsRepository);

    it('should create new blog', async () => {
      await request(app.getHttpServer())
        .post('/blogs')
        .set(
          'Authorization',
          'Basic ' + Buffer.from('admin:qwerty').toString('base64'),
        )
        .send({
          name: 'new blog',
          description: 'description for new blog',
          websiteUrl: 'https://www.youtube.com/',
        })
        .expect(HTTP_STATUSES.CREATED_201);
    });
    it('should create second blog', async () => {
      await request(app.getHttpServer())
        .post('/blogs')
        .set(
          'Authorization',
          'Basic ' + Buffer.from('admin:qwerty').toString('base64'),
        )
        .send({
          name: 'second blog',
          description: 'description for new blog',
          websiteUrl: 'https://www.youtube.com/',
        })
        .expect(HTTP_STATUSES.CREATED_201);
    });

    it('should return created blog', async () => {
      const res_ = await request(app.getHttpServer())
        .get('/blogs')
        .expect(HTTP_STATUSES.OK_200);
      expect(res_.body.items.length).toBe(2);
    });

    it('should update blog with input data', async () => {
      const foundBlog = await blogsRepository.findBlogByName('new blog');
      await request(app.getHttpServer())
        .put(`/blogs/${foundBlog!._id}`)
        .auth('admin', 'qwerty')
        .send({
          name: 'new blog',
          description: 'description for new blog!',
          websiteUrl: 'https://www.youtube.com/',
        })
        .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

    it('should return updated blog', async () => {
      const foundBlog = await blogsRepository.findBlogByName('new blog');
      const _res = await request(app.getHttpServer())
        .get(`/blogs/${foundBlog!._id}`)
        .expect(HTTP_STATUSES.OK_200);
      expect(_res.body.description).toBe('description for new blog!');
    });

    it('should delete test blog', async () => {
      await request(app.getHttpServer())
        .post('/blogs')
        .set(
          'Authorization',
          'Basic ' + Buffer.from('admin:qwerty').toString('base64'),
        )
        .send({
          name: 'test blog',
          description: 'description for new blog',
          websiteUrl: 'https://www.youtube.com/',
        })
        .expect(HTTP_STATUSES.CREATED_201);
      const foundBlog = await blogsRepository.findBlogByName('test blog');
      await request(app.getHttpServer())
        .delete(`/blogs/${foundBlog!._id}`)
        .auth('admin', 'qwerty')
        .expect(HTTP_STATUSES.NO_CONTENT_204);
      const res_ = await request(app.getHttpServer()).get('/blogs');
      expect(res_.body.items.length).toBe(2);
    });
  });

  describe('/posts', () => {
    // const blogsRepository = app.get<BlogsRepository>(BlogsRepository);
    // const postsRepository = app.get<PostsRepository>(PostsRepository);
    it('should create new post', async () => {
      const foundBlog = await blogsRepository.findBlogByName('new blog');

      await request(app.getHttpServer())
        .post('/posts')
        .set(
          'Authorization',
          'Basic ' + Buffer.from('admin:qwerty').toString('base64'),
        )
        .send({
          title: 'new title post',
          shortDescription: 'new description for post',
          content: 'content for post',
          blogId: foundBlog!._id.toString(),
          // "blogId": "123"
        })
        .expect(HTTP_STATUSES.CREATED_201);
    });
    it('should create new post for second blog', async () => {
      const foundBlog = await blogsRepository.findBlogByName('second blog');

      await request(app.getHttpServer())
        .post('/posts')
        .set(
          'Authorization',
          'Basic ' + Buffer.from('admin:qwerty').toString('base64'),
        )
        .send({
          title: 'new title post',
          shortDescription: 'new description for post',
          content: 'content for post',
          blogId: foundBlog!._id.toString(),
          // "blogId": "123"
        })
        .expect(HTTP_STATUSES.CREATED_201);
    });

    it('should return created post', async () => {
      const res_ = await request(app.getHttpServer())
        .get('/posts')
        .expect(HTTP_STATUSES.OK_200);
      expect(res_.body.items.length).toBe(2);
    });

    it('should update post with input data', async () => {
      const foundPost = await postsRepository.findPostByTitle('new title post');
      const foundBlog = await blogsRepository.findBlogByName('new blog');
      await request(app.getHttpServer())
        .put(`/posts/${foundPost!._id}`)
        .auth('admin', 'qwerty')
        .send({
          title: 'new title post',
          shortDescription: 'this post was change!',
          content: 'content for post',
          blogId: foundBlog!._id.toString(),
        })
        .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

    it('should return updated post', async () => {
      const foundPost = await postsRepository.findPostByTitle('new title post');
      const _res = await request(app.getHttpServer())
        .get(`/posts/${foundPost!._id}`)
        .expect(HTTP_STATUSES.OK_200);
      expect(_res.body.shortDescription).toBe('this post was change!');
    });

    it('should delete test post', async () => {
      const foundBlog = await blogsRepository.findBlogByName('new blog');
      await request(app.getHttpServer())
        .post('/posts')
        .set(
          'Authorization',
          'Basic ' + Buffer.from('admin:qwerty').toString('base64'),
        )
        .send({
          title: 'test post',
          shortDescription: 'asd asd asd asd asd asd asd asd',
          content: 'content for test post',
          blogId: foundBlog!._id.toString(),
        })
        .expect(HTTP_STATUSES.CREATED_201);
      const foundPost = await postsRepository.findPostByTitle('test post');
      await request(app.getHttpServer())
        .delete(`/posts/${foundPost!._id}`)
        .auth('admin', 'qwerty')
        .expect(HTTP_STATUSES.NO_CONTENT_204);
      const res_ = await request(app.getHttpServer()).get('/posts');
      expect(res_.body.items.length).toBe(2);
    });
    it('should return all posts from blogId', async () => {
      const foundBlog = await blogsRepository.findBlogByName('second blog');
      const res_ = await request(app.getHttpServer()).get(
        `/blogs/${foundBlog!._id.toString()}/posts`,
      );
      expect(res_.body.items.length).toBe(1);
    });
  });
  //
  // describe('/comments', () => {
  //   // const usersRepository = app.get<UsersRepository>(UsersRepository);
  //   // const postsRepository = app.get<PostsRepository>(PostsRepository);
  //   // const commentsRepository = app.get<CommentsRepository>(CommentsRepository);
  //   // const devicesRepository = app.get<DeviceRepository>(DeviceRepository);
  //   // const jwtService = app.get<JwtService>(JwtService);
  //
  //   it('should create new comment from correct input data', async () => {
  //     const foundUser = await usersRepository.findUserByLogin('Leha');
  //     const device = await devicesRepository.findDeviceTestByUserId(
  //       foundUser!._id.toString(),
  //     );
  //     const accessTokenByUserId = await jwtService.createAccessJWT(device!._id);
  //     // const userId = foundUser!._id.toString()
  //     // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
  //     const foundPost = await postsRepository.findPostByTitle('new title post');
  //     const res_ = await request(app.getHttpServer())
  //       .post(`/posts/${foundPost!._id}/comments`)
  //       .set('Authorization', `Bearer ${accessTokenByUserId}`)
  //       .send({
  //         content: 'content for new comment',
  //       })
  //       .expect(HTTP_STATUSES.CREATED_201);
  //     expect({
  //       id: expect(res_.body.id).toEqual(expect.any(String)),
  //       content: expect(res_.body.content).toEqual('content for new comment'),
  //       commentatorInfo: {
  //         userId: expect(res_.body.commentatorInfo.userId).toEqual(
  //           foundUser!._id.toString(),
  //         ),
  //         userLogin: expect(res_.body.commentatorInfo.userLogin).toEqual(
  //           'Leha',
  //         ),
  //       },
  //       createdAt: expect(res_.body.createdAt).toEqual(expect.any(String)),
  //       likesInfo: {
  //         likesCount: expect(res_.body.likesInfo.likesCount).toEqual(0),
  //         dislikesCount: expect(res_.body.likesInfo.dislikesCount).toEqual(0),
  //         myStatus: expect(res_.body.likesInfo.myStatus).toEqual('None'),
  //       },
  //     });
  //   });
  //
  //   it('should update and check created comment', async () => {
  //     const foundUser = await usersRepository.findUserByLogin('Leha');
  //     const device = await devicesRepository.findDeviceTestByUserId(
  //       foundUser!._id.toString(),
  //     );
  //     const accessTokenByUserId = await jwtService.createAccessJWT(device!._id);
  //     // const userId = foundUser!._id.toString()
  //     // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
  //     const foundPost = await postsRepository.findPostByTitle('new title post');
  //     const foundComment = await commentsRepository.findCommentByPostId(
  //       foundPost!._id.toString(),
  //     );
  //
  //     await request(app)
  //       .put(`/comments/${foundComment!._id}`)
  //       .set('Authorization', `Bearer ${accessTokenByUserId}`)
  //       .send({ content: 'this content was changed!' })
  //       .expect(HTTP_STATUSES.NO_CONTENT_204);
  //   });
  //
  //   it('should delete test comment', async () => {
  //     const foundUser = await usersRepository.findUserByLogin('Leha');
  //     const device = await devicesRepository.findDeviceTestByUserId(
  //       foundUser!._id.toString(),
  //     );
  //     const accessTokenByUserId = await jwtService.createAccessJWT(device!._id);
  //     // const userId = foundUser!._id.toString()
  //     // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
  //     const foundPost = await postsRepository.findPostByTitle('new title post');
  //
  //     await request(app.getHttpServer())
  //       .post(`/posts/${foundPost!._id}/comments`)
  //       .set('Authorization', `Bearer ${accessTokenByUserId}`)
  //       .send({
  //         content: 'created comment for test',
  //       })
  //       .expect(HTTP_STATUSES.CREATED_201);
  //
  //     const foundComment = await commentsRepository.findCommentByContent(
  //       'created comment for test',
  //     );
  //     await request(app.getHttpServer())
  //       .delete(`/comments/${foundComment!._id}`)
  //       .set('Authorization', `Bearer ${accessTokenByUserId}`)
  //       .expect(HTTP_STATUSES.NO_CONTENT_204);
  //
  //     const res_ = await request(app.getHttpServer())
  //       .get(`/posts/${foundPost!._id}/comments`)
  //       .expect(HTTP_STATUSES.OK_200);
  //     expect(res_.body.items.length).toBe(1);
  //   });
  //   it('should update comment like-status', async () => {
  //     const foundUser = await usersRepository.findUserByLogin('Leha');
  //     const device = await devicesRepository.findDeviceTestByUserId(
  //       foundUser!._id.toString(),
  //     );
  //     const accessTokenByUserId = await jwtService.createAccessJWT(device!._id);
  //
  //     const foundPost = await postsRepository.findPostByTitle('new title post');
  //     const foundComment = await commentsRepository.findCommentByPostId(
  //       foundPost!._id.toString(),
  //     );
  //
  //     await request(app.getHttpServer())
  //       .put(`/comments/${foundComment!._id}/like-status`)
  //       .set('Authorization', `Bearer ${accessTokenByUserId}`)
  //       .send({ likeStatus: 'None' })
  //       .expect(HTTP_STATUSES.NO_CONTENT_204);
  //   });
  //
  //   it('should like to be 2', async () => {
  //     const Leha = await usersRepository.findUserByLogin('Leha');
  //     const deviceLeha = await devicesRepository.findDeviceTestByUserId(
  //       Leha!._id.toString(),
  //     );
  //     const accessTokenByLeha = await jwtService.createAccessJWT(
  //       deviceLeha!._id,
  //     );
  //     const admin = await usersRepository.findUserByLogin('admin');
  //     const accessTokenByAdmin = await jwtService.createAccessJWT(admin!._id);
  //
  //     const foundPost = await postsRepository.findPostByTitle('new title post');
  //     const foundComment = await commentsRepository.findCommentByPostId(
  //       foundPost!._id.toString(),
  //     );
  //
  //     await request(app.getHttpServer())
  //       .put(`/comments/${foundComment!._id}/like-status`)
  //       .set('Authorization', `Bearer ${accessTokenByLeha}`)
  //       .send({ likeStatus: 'Like' })
  //       .expect(HTTP_STATUSES.NO_CONTENT_204);
  //
  //     await request(app.getHttpServer())
  //       .put(`/comments/${foundComment!._id}/like-status`)
  //       .set('Authorization', `Bearer ${accessTokenByAdmin}`)
  //       .send({ likeStatus: 'Like' })
  //       .expect(HTTP_STATUSES.NO_CONTENT_204);
  //
  //     const res_ = await request(app.getHttpServer())
  //       .get(`/comments/${foundComment!._id}`)
  //       .set('Authorization', `Bearer ${accessTokenByLeha}`)
  //       .expect(HTTP_STATUSES.OK_200);
  //     expect({
  //       id: expect(res_.body.id).toEqual(expect.any(String)),
  //       content: expect(res_.body.content).toEqual(expect.any(String)),
  //       commentatorInfo: {
  //         userId: expect(res_.body.commentatorInfo.userId).toEqual(
  //           Leha!._id.toString(),
  //         ),
  //         userLogin: expect(res_.body.commentatorInfo.userLogin).toEqual(
  //           'Leha',
  //         ),
  //       },
  //       createdAt: expect(res_.body.createdAt).toEqual(expect.any(String)),
  //       likesInfo: {
  //         likesCount: expect(res_.body.likesInfo.likesCount).toEqual(2),
  //         dislikesCount: expect(res_.body.likesInfo.dislikesCount).toEqual(0),
  //         myStatus: expect(res_.body.likesInfo.myStatus).toEqual('Like'),
  //       },
  //     });
  //   });
  // });
  //
  // describe('/comments/{postId}/like-status', () => {
  //   // const usersRepository = app.get<UsersRepository>(UsersRepository);
  //   // const postsRepository = app.get<PostsRepository>(PostsRepository);
  //   // const devicesRepository = app.get<DeviceRepository>(DeviceRepository);
  //   // const jwtService = app.get<JwtService>(JwtService);
  //   it('should update post like-status', async () => {
  //     const Leha = await usersRepository.findUserByLogin('Leha');
  //     const deviceLeha = await devicesRepository.findDeviceTestByUserId(
  //       Leha!._id.toString(),
  //     );
  //     const accessTokenByLeha = await jwtService.createAccessJWT(
  //       deviceLeha!._id,
  //     );
  //     const admin = await usersRepository.findUserByLogin('admin');
  //     const accessTokenByAdmin = await jwtService.createAccessJWT(admin!._id);
  //
  //     const foundPost = await postsRepository.findPostByTitle('new title post');
  //
  //     await request(app.getHttpServer())
  //       .put(`/posts/${foundPost!._id}/like-status`)
  //       .set('Authorization', `Bearer ${accessTokenByLeha}`)
  //       .send({ likeStatus: 'Like' })
  //       .expect(HTTP_STATUSES.NO_CONTENT_204);
  //
  //     await request(app.getHttpServer())
  //       .put(`/posts/${foundPost!._id}/like-status`)
  //       .set('Authorization', `Bearer ${accessTokenByAdmin}`)
  //       .send({ likeStatus: 'Dislike' })
  //       .expect(HTTP_STATUSES.NO_CONTENT_204);
  //
  //     const res_ = await request(app.getHttpServer())
  //       .get(`/posts/${foundPost!._id}`)
  //       .set('Authorization', `Bearer ${accessTokenByLeha}`)
  //       .expect(HTTP_STATUSES.OK_200);
  //
  //     expect({
  //       id: expect(res_.body.id).toEqual(expect.any(String)),
  //       title: 'string',
  //       shortDescription: 'string',
  //       content: 'string',
  //       blogId: 'string',
  //       blogName: 'string',
  //       createdAt: '2023-12-24T08:28:09.955Z',
  //       extendedLikesInfo: {
  //         likesCount: expect(res_.body.extendedLikesInfo.likesCount).toEqual(1),
  //         dislikesCount: expect(
  //           res_.body.extendedLikesInfo.dislikesCount,
  //         ).toEqual(1),
  //         myStatus: expect(res_.body.extendedLikesInfo.myStatus).toEqual(
  //           'Like',
  //         ),
  //         newestLikes: [
  //           {
  //             addedAt: '2023-12-24T08:28:09.955Z',
  //             userId: 'string',
  //             login: 'string',
  //           },
  //         ],
  //       },
  //     });
  //   });
  //   it('should Expected status: 400 when incorrect input like-status', async () => {
  //     const Leha = await usersRepository.findUserByLogin('Leha');
  //     const deviceLeha = await devicesRepository.findDeviceTestByUserId(
  //       Leha!._id.toString(),
  //     );
  //     const accessTokenByLeha = await jwtService.createAccessJWT(
  //       deviceLeha!._id,
  //     );
  //
  //     const foundPost = await postsRepository.findPostByTitle('new title post');
  //
  //     await request(app.getHttpServer())
  //       .put(`/posts/${foundPost!._id}/like-status`)
  //       .set('Authorization', `Bearer ${accessTokenByLeha}`)
  //       .send({ likeStatus: '' })
  //       .expect(HTTP_STATUSES.BAD_REQUEST_400);
  //   });
  // });
});
