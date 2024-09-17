import { Service, ServiceInput } from '@application/_base/service';
import { BookRentalRepository } from '@entities/book-rentals/gateway/book-rental-repository';
import { BookRental } from '@entities/book-rentals/models/book-rental';
import { Logger } from '@lib/logger';

export interface GetBookRentalByIdInputParams {
  id: number;
}

export type GetBookRentalByIdOutput = {
  id?: number | null;
  creationDate?: Date | null;
  maxReturnDate?: Date | null;
  returnDate?: Date | null;
  customerId?: number | null;
  bookId?: number | null;
};

export class GetBookRentalById implements Service<ServiceInput<GetBookRentalByIdInputParams, void>, GetBookRentalByIdOutput> {
  public static create(bookRentalsRepository: BookRentalRepository, logger: Logger) {
    return new GetBookRentalById(bookRentalsRepository, logger);
  }

  private constructor(
    private readonly bookRentalsRepository: BookRentalRepository,
    private readonly logger: Logger
  ) {}

  public async handler(input: ServiceInput<GetBookRentalByIdInputParams, void>): Promise<GetBookRentalByIdOutput> {
    this.logger.info('GetBookRentalById - input:', input);
    const bookRental = await this.bookRentalsRepository.getById(input.params!.id);

    return this.getOutput(bookRental);
  }

  private getOutput(bookRental?: BookRental | null): GetBookRentalByIdOutput {
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
