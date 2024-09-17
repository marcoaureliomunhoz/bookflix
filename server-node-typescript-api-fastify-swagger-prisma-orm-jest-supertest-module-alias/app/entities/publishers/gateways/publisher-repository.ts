import { Publisher } from '../models/publisher';

export interface PublisherRepository {
  insert(publisher: Publisher): Promise<Publisher>;
  update(publisher: Publisher): Promise<Publisher>;
  count(): Promise<number>;
  list(includes?: number[], page?: number | null, pageSize?: number | null): Promise<Publisher[]>;
  getById(id: number): Promise<Publisher | null | undefined>;
  delete(id: number): Promise<Publisher>;
}
