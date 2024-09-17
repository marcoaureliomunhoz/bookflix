import { PrismaClient } from '@prisma/client';

export class PrismaDbContext {
  private db: PrismaClient | null = null;

  constructor() {}

  connect(): Promise<PrismaClient> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        return resolve(this.db);
      }
      //console.log(`connecting to db at ${process?.env?.DATABASE_URL}...`);
      console.log('connecting to db...');
      this.db = new PrismaClient();
      this.db
        .$connect()
        .then(() => {
          resolve(this.db!);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('disconnecting db...');
      if (!this.db) {
        return resolve();
      }
      this.db
        .$disconnect()
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
}
