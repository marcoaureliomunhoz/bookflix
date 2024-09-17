import { PrismaDbContext } from './prisma-db-context';
import { BookRentalRepository } from '@entities/book-rentals/gateway/book-rental-repository';
import { BookRental } from '@entities/book-rentals/models/book-rental';
import { Customer } from '@entities/customers/models/customer';
import { Book } from '@entities/books/models/book';

export class BookRentalRepositoryPrisma implements BookRentalRepository {
  private constructor(private readonly db: PrismaDbContext) {}

  public static create(db: PrismaDbContext) {
    return new BookRentalRepositoryPrisma(db);
  }

  private createBookRentalFromModel(model: any): BookRental {
    return BookRental.createFromProps({
      id: model.book_rental_id,
      customerId: model.customer_id,
      bookId: model.book_id,
      creationDate: model.creation_id,
      maxReturnDate: model.max_return_date,
      returnDate: model.return_date,
      book: model.book
        ? Book.createFromProps({
            id: model.book.book_id,
            title: model.book.title,
            deletionDate: model.book.deletion_date,
            quantity: model.book.quantity,
            maxRentalDays: model.book.max_rental_days,
            publisherId: model.book.publisher_id,
            numberOfRentals: model.book.number_of_rentals,
            numberOfReturns: model.book.number_of_returns
          })
        : null,
      customer: model.customer
        ? Customer.createFromProps({
            id: model.customer.customer_id,
            name: model.customer.name,
            deletionDate: model.customer.deletion_date
          })
        : null
    });
  }

  public async insert(bookRental: BookRental): Promise<BookRental> {
    const cnn = await this.db.connect();
    const data = {
      customer_id: bookRental.customerId,
      book_id: bookRental.bookId,
      creation_date: bookRental.creationDate,
      max_return_date: bookRental.maxReturnDate,
      return_date: bookRental.returnDate
    };
    const newData = await cnn.bookRental.create({ data });
    return this.createBookRentalFromModel(newData);
  }

  public async update(bookRental: BookRental): Promise<BookRental> {
    const cnn = await this.db.connect();
    const data = {
      customer_id: bookRental.customerId,
      book_id: bookRental.bookId,
      creation_date: bookRental.creationDate,
      max_return_date: bookRental.maxReturnDate,
      return_date: bookRental.returnDate
    };
    const newData = await cnn.bookRental.update({ data, where: { book_rental_id: bookRental.id } });
    return this.createBookRentalFromModel(newData);
  }

  public async list(page?: number | null, pageSize?: number | null): Promise<BookRental[]> {
    const pageNumber = page && page > 0 ? page - 1 : 0;
    const cnn = await this.db.connect();
    const data = await cnn.bookRental.findMany({
      include: {
        book: true,
        customer: true
      },
      orderBy: {
        book_rental_id: 'desc'
      },
      take: pageSize && pageSize > 0 ? pageSize : undefined,
      skip: pageSize && pageSize > 0 ? pageNumber * pageSize : 0
    });
    return data.map((dv) => {
      return this.createBookRentalFromModel(dv);
    });
  }

  public async count(): Promise<number> {
    const cnn = await this.db.connect();
    const data = await cnn.bookRental.count();
    return data;
  }

  public async getById(id: number): Promise<BookRental | null | undefined> {
    const cnn = await this.db.connect();
    const data = await cnn.bookRental.findFirst({
      where: {
        book_rental_id: id
      },
      include: {
        book: true,
        customer: true
      }
    });
    return data ? this.createBookRentalFromModel(data) : null;
  }

  public async delete(id: number): Promise<BookRental> {
    const cnn = await this.db.connect();
    const data = await cnn.bookRental.delete({
      where: {
        book_rental_id: id
      }
    });
    return this.createBookRentalFromModel(data);
  }
}
