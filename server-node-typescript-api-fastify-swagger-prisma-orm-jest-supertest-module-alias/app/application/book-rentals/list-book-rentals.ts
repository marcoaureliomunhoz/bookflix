import { Service, ServiceInput } from '@application/_base/service';
import { BookRentalRepository } from '@entities/book-rentals/gateway/book-rental-repository';
import { BookRental } from '@entities/book-rentals/models/book-rental';
import { Pagination } from '../_base/pagination';

export interface ListBookRentalsInputQuery {
  page?: number | null;
  pageSize?: number | null;
}

export interface ListBookRentalsOutput {
  list: {
    id?: number | null;
    creationDate?: Date | null;
    maxReturnDate?: Date | null;
    returnDate?: Date | null;
    customerId?: number | null;
    customerName?: string | null;
    bookId?: number | null;
    bookTitle?: string | null;
  }[];
  pagination: Pagination;
}

export class ListBookRentals implements Service<ServiceInput<void, void, ListBookRentalsInputQuery>, ListBookRentalsOutput> {
  public static create(bookRentalRepository: BookRentalRepository) {
    return new ListBookRentals(bookRentalRepository);
  }

  private constructor(private readonly bookRentalRepository: BookRentalRepository) {}

  public async handler(input: ServiceInput<void, void, ListBookRentalsInputQuery>): Promise<ListBookRentalsOutput> {
    const list = await this.bookRentalRepository.list(input.query?.page, input.query?.pageSize);
    return this.getOutput(list, input);
  }

  private async getOutput(list?: BookRental[] | null, input?: ServiceInput<void, void, ListBookRentalsInputQuery> | null): Promise<ListBookRentalsOutput> {
    return {
      list:
        list?.map((bookRental) => ({
          id: bookRental?.id,
          bookId: bookRental?.bookId,
          customerId: bookRental?.customerId,
          creationDate: bookRental?.creationDate,
          maxReturnDate: bookRental?.maxReturnDate,
          returnDate: bookRental?.returnDate,
          bookTitle: bookRental?.book?.title,
          customerName: bookRental?.customer?.name
        })) || [],
      pagination: await this.getPagination(list, input)
    };
  }

  private async getPagination(list?: BookRental[] | null, input?: ServiceInput<void, void, ListBookRentalsInputQuery> | null): Promise<Pagination> {
    const pageSize = input?.query?.pageSize ?? 0;
    const count = pageSize > 0 ? await this.bookRentalRepository.count() : list?.length;
    return Pagination.create(input?.query?.page, pageSize, count);
  }
}
