import { Book } from '../models/book';

export interface BookRepository {
  insert(book: Book): Promise<Book>;
  update(book: Book): Promise<Book>;
  list(page?: number | null, pageSize?: number | null): Promise<Book[]>;
  count(): Promise<number>;
  getById(id: number): Promise<Book | null | undefined>;
  delete(id: number): Promise<Book>;
}
