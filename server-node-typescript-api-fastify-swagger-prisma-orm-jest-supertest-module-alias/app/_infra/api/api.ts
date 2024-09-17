import * as http from 'http';

export interface Api {
  run(): Promise<void>;
  close(): Promise<void>;
  ready(): Promise<void>;
  getHttpServer(): http.Server;
}
