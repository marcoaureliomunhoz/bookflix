import { Service, ServiceInput } from '@application/_base/service';
import { BookRentalRepository } from '@entities/book-rentals/gateway/book-rental-repository';
import { BookRepository } from '@entities/books/gateways/book-repository';
import { BookRental } from '@entities/book-rentals/models/book-rental';

export interface InsertBookRentalInputBody {
  maxReturnDate?: Date | null;
  customerId?: number | null;
  bookId?: number | null;
}

export interface InsertBookRentalOutput {
  id?: number | null;
  creationDate?: Date | null;
  maxReturnDate?: Date | null;
  returnDate?: Date | null;
  customerId?: number | null;
  bookId?: number | null;
}

export class InsertBookRental implements Service<ServiceInput<void, InsertBookRentalInputBody>, InsertBookRentalOutput> {
  public static create(bookRentalRepository: BookRentalRepository, bookRepository: BookRepository) {
    return new InsertBookRental(bookRentalRepository, bookRepository);
  }

  private constructor(
    private readonly bookRentalRepository: BookRentalRepository,
    private readonly bookRepository: BookRepository
  ) {}

  public async handler(input: ServiceInput<void, InsertBookRentalInputBody>): Promise<InsertBookRentalOutput> {
    const bookRental = BookRental.create(input.body!.maxReturnDate!, input.body!.customerId!, input.body!.bookId!);

    const insertedBook = await this.bookRentalRepository.insert(bookRental);

    await this.updateBook(bookRental.bookId);

    return this.getOutput(insertedBook);
  }

  private async updateBook(bookId?: number | null) {
    if (!bookId) return;
    const book = await this.bookRepository.getById(bookId);
    if (!book) return;
    book.rent();
    this.bookRepository.update(book);
  }

  private getOutput(bookRental?: BookRental | null): InsertBookRentalOutput {
    return {
      id: bookRental?.id,
      bookId: bookRental?.bookId,
      customerId: bookRental?.customerId,
      creationDate: bookRental?.creationDate,
      maxReturnDate: bookRental?.maxReturnDate,
      returnDate: bookRental?.returnDate
    };
  }
}
