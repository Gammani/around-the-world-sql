import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('integration tests for AuthService', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('create user', () => {
    it('should return', async () => {
      await expect(5).toBe(5);
    });
  });
});
