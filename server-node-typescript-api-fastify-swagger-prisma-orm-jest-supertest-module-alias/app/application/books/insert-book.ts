import { Service, ServiceInput } from '@application/_base/service';
import { BookRepository } from '@entities/books/gateways/book-repository';
import { Book } from '@entities/books/models/book';

export interface InsertBookInputBody {
  title?: string;
  quantity?: number | null;
  maxRentalDays?: number | null;
  publisherId?: number | null;
}

export interface InsertBookOutput {
  id?: number | null;
  title?: string | null;
  publisherId?: number | null;
  quantity?: number | null;
  maxRentalDays?: number | null;
  numberOfRentals?: number | null;
  numberOfReturns?: number | null;
}

export class InsertBook implements Service<ServiceInput<void, InsertBookInputBody>, InsertBookOutput> {
  public static create(bookRepository: BookRepository) {
    return new InsertBook(bookRepository);
  }

  private constructor(private readonly bookRepository: BookRepository) {}

  public async handler(input: ServiceInput<void, InsertBookInputBody>): Promise<InsertBookOutput> {
    const book = Book.create(input.body!.title!, input.body!.quantity, input.body!.maxRentalDays, input.body!.publisherId);

    const insertedBook = await this.bookRepository.insert(book);

    return this.getOutput(insertedBook);
  }

  private getOutput(book?: Book | null): InsertBookOutput {
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
