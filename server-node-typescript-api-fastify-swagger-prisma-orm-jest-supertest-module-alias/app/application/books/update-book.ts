import { Service, ServiceInput } from '@application/_base/service';
import { BookRepository } from '@entities/books/gateways/book-repository';
import { Book } from '@entities/books/models/book';

export interface UpdateBookInputParams {
  id?: number | null;
}

export interface UpdateBookInputBody {
  title?: string;
  publisherId?: number | null;
  quantity?: number | null;
  maxRentalDays?: number | null;
}

export interface UpdateBookOutput {
  id?: number | null;
  title?: string | null;
  publisherId?: number | null;
  quantity?: number | null;
  maxRentalDays?: number | null;
  numberOfRentals?: number | null;
  numberOfReturns?: number | null;
}

export class UpdateBook implements Service<ServiceInput<UpdateBookInputParams, UpdateBookInputBody>, UpdateBookOutput> {
  public static create(bookRepository: BookRepository) {
    return new UpdateBook(bookRepository);
  }

  private constructor(private readonly bookRepository: BookRepository) {}

  public async handler(input: ServiceInput<UpdateBookInputParams, UpdateBookInputBody>): Promise<UpdateBookOutput> {
    const id = Number(input.params?.id || 0);

    const book = id > 0 ? await this.bookRepository.getById(id) : null;

    if (!book) {
      return this.getOutput(null);
    }

    book.update(input.body!.title!, input.body?.quantity, input.body?.maxRentalDays, input.body?.publisherId);

    const updatedbook = await this.bookRepository.update(book);

    return this.getOutput(updatedbook);
  }

  private getOutput(book?: Book | null): UpdateBookOutput {
    return {
      id: book?.id,
      title: book?.title,
      publisherId: book?.publisherId,
      quantity: book?.quantity,
      maxRentalDays: book?.maxRentalDays,
      numberOfRentals: book?.numberOfRentals,
      numberOfReturns: book?.numberOfReturns
    };
  }
}
