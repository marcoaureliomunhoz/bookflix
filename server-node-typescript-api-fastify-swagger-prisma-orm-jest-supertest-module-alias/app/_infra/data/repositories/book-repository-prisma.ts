import { PrismaDbContext } from './prisma-db-context';
import { BookRepository } from '@entities/books/gateways/book-repository';
import { Book } from '@entities/books/models/book';

export class BookRepositoryPrisma implements BookRepository {
  private constructor(private readonly db: PrismaDbContext) {}

  public static create(db: PrismaDbContext) {
    return new BookRepositoryPrisma(db);
  }

  private createBookFromModel(model: any): Book {
    return Book.createFromProps({
      id: model.book_id,
      title: model.title,
      deletionDate: model.deletion_date,
      quantity: model.quantity,
      maxRentalDays: model.max_rental_days,
      publisherId: model.publisher_id,
      numberOfRentals: model.number_of_rentals,
      numberOfReturns: model.number_of_returns
    });
  }

  public async insert(book: Book): Promise<Book> {
    const cnn = await this.db.connect();
    const data = {
      title: book.title,
      quantity: book.quantity,
      max_rental_days: book.maxRentalDays,
      publisher_id: book.publisherId,
      number_of_rentals: book.numberOfRentals,
      number_of_returns: book.numberOfReturns
    };
    const newData = await cnn.book.create({ data });
    return this.createBookFromModel(newData);
  }

  public async update(book: Book): Promise<Book> {
    const cnn = await this.db.connect();
    const data = {
      title: book.title,
      quantity: book.quantity,
      max_rental_days: book.maxRentalDays,
      publisher_id: book.publisherId,
      number_of_rentals: book.numberOfRentals,
      number_of_returns: book.numberOfReturns
    };
    const newData = await cnn.book.update({ data, where: { book_id: book.id } });
    return this.createBookFromModel(newData);
  }

  public async list(page?: number | null, pageSize?: number | null): Promise<Book[]> {
    const pageNumber = page && page > 0 ? page - 1 : 0;
    const cnn = await this.db.connect();
    const data = await cnn.book.findMany({
      where: { deletion_date: null },
      take: pageSize && pageSize > 0 ? pageSize : undefined,
      skip: pageSize && pageSize > 0 ? pageNumber * pageSize : 0
    });
    return data.map((dv) => {
      return this.createBookFromModel(dv);
    });
  }

  public async count(): Promise<number> {
    const cnn = await this.db.connect();
    const data = await cnn.book.count();
    return data;
  }

  public async getById(id: number): Promise<Book | null | undefined> {
    const cnn = await this.db.connect();
    const data = await cnn.book.findFirst({
      where: {
        book_id: id
      }
    });
    return data ? this.createBookFromModel(data) : null;
  }

  public async delete(id: number): Promise<Book> {
    const cnn = await this.db.connect();
    const data = await cnn.book.delete({
      where: {
        book_id: id
      }
    });
    return this.createBookFromModel(data);
  }
}
