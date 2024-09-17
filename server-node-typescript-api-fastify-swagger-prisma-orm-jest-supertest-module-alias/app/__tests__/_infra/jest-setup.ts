import { Logger } from '@app/lib/logger';
import { ApiFastify } from '@infra/api/api-fastify';
import supertest from 'supertest';

console.log('process?.env?.ENV_FILE:', process?.env?.ENV_FILE);
const envFileIncludesTestAndDocker = (process?.env?.ENV_FILE || '').includes('test') && (process?.env?.ENV_FILE || '').includes('docker');
console.log('envFileIncludesTestAndDocker:', envFileIncludesTestAndDocker);
if (envFileIncludesTestAndDocker) {
  let api: ApiFastify;

  beforeAll(async () => {
    api = new ApiFastify(Logger.create());
    await api.run();
  });

  beforeEach(async () => {
    await api.ready();
    globalThis.superRequest = supertest(api.getHttpServer());
  });

  afterAll(async () => {
    await api.close();
  });
}
