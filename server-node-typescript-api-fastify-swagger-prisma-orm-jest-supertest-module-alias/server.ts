import './app/_infra/config/module-alias-config';
import { ApiFastify } from '@infra/api/api-fastify';
import { Logger } from '@lib/logger';

async function server() {
  const serverHost = process?.env?.SERVER_HOST || '127.0.0.1';
  const serverPort = Number(process?.env?.SERVER_PORT || 3000);
  const api = new ApiFastify(Logger.create(), serverHost, serverPort);
  await api.run();
}

server().then(() => {
  Logger.create().info('server - running...');
});
