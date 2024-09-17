import { Service, ServiceInput } from '@application/_base/service';
import { BookRentalRepository } from '@entities/book-rentals/gateway/book-rental-repository';
import { BookRental } from '@entities/book-rentals/models/book-rental';

export interface UpdateBookRentalInputParams {
  id?: number | null;
}

export interface UpdateBookRentalInputBody {
  maxReturnDate?: Date | null;
  customerId?: number | null;
  bookId?: number | null;
}

export interface UpdateBookRentalOutput {
  id?: number | null;
  creationDate?: Date | null;
  maxReturnDate?: Date | null;
  returnDate?: Date | null;
  customerId?: number | null;
  bookId?: number | null;
}

export class UpdateBookRental implements Service<ServiceInput<UpdateBookRentalInputParams, UpdateBookRentalInputBody>, UpdateBookRentalOutput> {
  public static create(bookRentalRepository: BookRentalRepository) {
    return new UpdateBookRental(bookRentalRepository);
  }

  private constructor(private readonly bookRentalRepository: BookRentalRepository) {}

  public async handler(input: ServiceInput<UpdateBookRentalInputParams, UpdateBookRentalInputBody>): Promise<UpdateBookRentalOutput> {
    const id = Number(input.params?.id || 0);

    const bookRental = id > 0 ? await this.bookRentalRepository.getById(id) : null;

    if (!bookRental) {
      return this.getOutput(null);
    }

    bookRental.update(input.body!.maxReturnDate!, input.body!.customerId!, input.body!.bookId!);

    const updatedbook = await this.bookRentalRepository.update(bookRental);

    return this.getOutput(updatedbook);
  }

  private getOutput(bookRental?: BookRental | null): UpdateBookRentalOutput {
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
