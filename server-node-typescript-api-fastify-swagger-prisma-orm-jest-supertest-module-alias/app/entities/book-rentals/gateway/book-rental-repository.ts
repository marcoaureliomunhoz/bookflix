import { BookRental } from '../models/book-rental';

export interface BookRentalRepository {
  insert(bookRental: BookRental): Promise<BookRental>;
  update(bookRental: BookRental): Promise<BookRental>;
  list(page?: number | null, pageSize?: number | null): Promise<BookRental[]>;
  count(): Promise<number>;
  getById(id: number): Promise<BookRental | null | undefined>;
  delete(id: number): Promise<BookRental>;
}
