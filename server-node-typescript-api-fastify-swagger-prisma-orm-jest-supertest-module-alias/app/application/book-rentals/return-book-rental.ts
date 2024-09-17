import { Service, ServiceInput } from '@application/_base/service';
import { BookRentalRepository } from '@entities/book-rentals/gateway/book-rental-repository';
import { BookRepository } from '@entities/books/gateways/book-repository';
import { BookRental } from '@entities/book-rentals/models/book-rental';

export interface ReturnBookRentalInputParams {
  id?: number | null;
}

export interface ReturnBookRentalOutput {
  id?: number | null;
  creationDate?: Date | null;
  maxReturnDate?: Date | null;
  returnDate?: Date | null;
  customerId?: number | null;
  bookId?: number | null;
}

export class ReturnBookRental implements Service<ServiceInput<ReturnBookRentalInputParams, void>, ReturnBookRentalOutput> {
  public static create(bookRentalRepository: BookRentalRepository, bookRepository: BookRepository) {
    return new ReturnBookRental(bookRentalRepository, bookRepository);
  }

  private constructor(
    private readonly bookRentalRepository: BookRentalRepository,
    private readonly bookRepository: BookRepository
  ) {}

  public async handler(input: ServiceInput<ReturnBookRentalInputParams, void>): Promise<ReturnBookRentalOutput> {
    console.log('return:', input);
    const id = Number(input.params?.id || 0);

    const bookRental = id > 0 ? await this.bookRentalRepository.getById(id) : null;

    if (!bookRental) {
      return this.getOutput(null);
    }

    bookRental.return();
    const updatedbook = await this.bookRentalRepository.update(bookRental);

    await this.updateBook(bookRental.bookId);

    return this.getOutput(updatedbook);
  }

  private async updateBook(bookId?: number | null) {
    if (!bookId) return;
    const book = await this.bookRepository.getById(bookId);
    if (!book) return;
    book.return();
    this.bookRepository.update(book);
  }

  private getOutput(bookRental?: BookRental | null): ReturnBookRentalOutput {
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
