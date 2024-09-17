import { Service, ServiceInput } from '@application/_base/service';
import { BookRepository } from '@entities/books/gateways/book-repository';
import { Book } from '@entities/books/models/book';
import { Pagination } from '../_base/pagination';

export interface ListBooksInputQuery {
  page?: number | null;
  pageSize?: number | null;
}

export interface ListBooksOutput {
  list: {
    id?: number | null;
    title?: string | null;
    deletionDate?: Date | null;
    publisherId?: number | null;
    quantity?: number | null;
    maxRentalDays?: number | null;
    numberOfRentals?: number | null;
    numberOfReturns?: number | null;
  }[];
  pagination: Pagination;
}

export class ListBooks implements Service<ServiceInput<void, void, ListBooksInputQuery>, ListBooksOutput> {
  public static create(bookRepository: BookRepository) {
    return new ListBooks(bookRepository);
  }

  private constructor(private readonly bookRepository: BookRepository) {}

  public async handler(input: ServiceInput<void, void, ListBooksInputQuery>): Promise<ListBooksOutput> {
    const list = await this.bookRepository.list(input.query?.page, input.query?.pageSize);

    return this.getOutput(list, input);
  }

  private async getOutput(list?: Book[] | null, input?: ServiceInput<void, void, ListBooksInputQuery> | null): Promise<ListBooksOutput> {
    return {
      list:
        list?.map((book) => ({
          id: book?.id,
          title: book?.title,
          deletionDate: book?.deletionDate,
          publisherId: book?.publisherId,
          quantity: book?.quantity,
          maxRentalDays: book?.maxRentalDays,
          numberOfRentals: book?.numberOfRentals,
          numberOfReturns: book?.numberOfReturns
        })) || [],
      pagination: await this.getPagination(list, input)
    };
  }

  private async getPagination(list?: Book[] | null, input?: ServiceInput<void, void, ListBooksInputQuery> | null): Promise<Pagination> {
    const pageSize = input?.query?.pageSize ?? 0;
    const count = pageSize > 0 ? await this.bookRepository.count() : list?.length;
    return Pagination.create(input?.query?.page, pageSize, count);
  }
}
