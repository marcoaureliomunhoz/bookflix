import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export class MockPrismaDbContext {
  private db: DeepMockProxy<PrismaClient> | null = null;

  constructor() {
    this.db = mockDeep<PrismaClient>();
  }

  get instance() {
    return this.db;
  }

  connect(): Promise<DeepMockProxy<PrismaClient>> {
    return new Promise((resolve) => {
      return resolve(this.db!);
    });
  }

  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      console.log('disconnecting db...');
      this.db = null;
      return resolve();
    });
  }
}
