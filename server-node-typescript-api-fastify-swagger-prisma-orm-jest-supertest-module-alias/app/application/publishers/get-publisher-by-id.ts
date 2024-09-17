import { Service, ServiceInput } from '@application/_base/service';
import { PublisherRepository } from '@entities/publishers/gateways/publisher-repository';
import { Publisher } from '@entities/publishers/models/publisher';
import { Logger } from '@lib/logger';

export interface GetPublisherByIdInputParams {
  id: number;
}

export type GetPublisherByIdOutput = {
  id?: number | null;
  name?: string | null;
  deletionDate?: Date | null;
};

export class GetPublisherById implements Service<ServiceInput<GetPublisherByIdInputParams, void>, GetPublisherByIdOutput> {
  public static create(publisherRepository: PublisherRepository, logger: Logger) {
    return new GetPublisherById(publisherRepository, logger);
  }

  private constructor(
    private readonly publisherRepository: PublisherRepository,
    private readonly logger: Logger
  ) {}

  public async handler(input: ServiceInput<GetPublisherByIdInputParams, void>): Promise<GetPublisherByIdOutput> {
    this.logger.info('GetPublisherById - input:', input);
    const publisher = await this.publisherRepository.getById(input.params!.id);

    return this.getOutput(publisher);
  }

  private getOutput(publisher?: Publisher | null): GetPublisherByIdOutput {
    return {
      id: publisher?.id,
      name: publisher?.name,
      deletionDate: publisher?.deletionDate
    };
  }
}
