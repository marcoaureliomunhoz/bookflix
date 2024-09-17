import { Service, ServiceInput } from '@application/_base/service';
import { BookRepository } from '@entities/books/gateways/book-repository';
import { Book } from '@entities/books/models/book';
import { Logger } from '@lib/logger';

export interface GetBookByIdInputParams {
  id: number;
}

export type GetBookByIdOutput = {
  id?: number | null;
  title?: string | null;
  deletionDate?: Date | null;
  publisherId?: number | null;
  quantity?: number | null;
  maxRentalDays?: number | null;
  numberOfRentals?: number | null;
  numberOfReturns?: number | null;
};

export class GetBookById implements Service<ServiceInput<GetBookByIdInputParams, void>, GetBookByIdOutput> {
  public static create(bookRepository: BookRepository, logger: Logger) {
    return new GetBookById(bookRepository, logger);
  }

  private constructor(
    private readonly bookRepository: BookRepository,
    private readonly logger: Logger
  ) {}

  public async handler(input: ServiceInput<GetBookByIdInputParams, void>): Promise<GetBookByIdOutput> {
    this.logger.info('GetBookById - input:', input);
    const book = await this.bookRepository.getById(input.params!.id);

    return this.getOutput(book);
  }

  private getOutput(book?: Book | null): GetBookByIdOutput {
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
