import { Service, ServiceInput } from '@application/_base/service';
import { BookRepository } from '@entities/books/gateways/book-repository';
import { Book } from '@entities/books/models/book';

export interface DeleteBookInputParams {
  id?: number | null;
}

export interface DeleteBookOutput {
  id?: number | null;
  title?: string | null;
  deletionDate?: Date | null;
  publisherId?: number | null;
  quantity?: number | null;
  maxRentalDays?: number | null;
  numberOfRentals?: number | null;
  numberOfReturns?: number | null;
}

export class DeleteBook implements Service<ServiceInput<DeleteBookInputParams, void>, DeleteBookOutput> {
  public static create(bookRepository: BookRepository) {
    return new DeleteBook(bookRepository);
  }

  private constructor(private readonly bookRepository: BookRepository) {}

  public async handler(input: ServiceInput<DeleteBookInputParams, void>): Promise<DeleteBookOutput> {
    const id = Number(input.params?.id || 0);

    const book = id > 0 ? await this.bookRepository.getById(id) : null;

    if (!book) {
      return this.getOutput(null);
    }

    const deletedBook = await this.bookRepository.delete(id);

    return this.getOutput(deletedBook);
  }

  private getOutput(book?: Book | null): DeleteBookOutput {
    return {
      id: book?.id,
      title: book?.title,
      deletionDate: book?.deletionDate,
      publisherId: book?.publisherId,
      quantity: book?.quantity,
      maxRentalDays: book?.maxRentalDays,
      numberOfRentals: book?.numberOfRentals,
      numberOfReturns: book?.numberOfReturns
    };
  }
}
