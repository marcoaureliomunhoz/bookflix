import { Service, ServiceInput } from '@application/_base/service';
import { PublisherRepository } from '@entities/publishers/gateways/publisher-repository';
import { Publisher } from '@entities/publishers/models/publisher';

export interface DeletePublisherInputParams {
  id?: number | null;
}

export interface DeletePublisherOutput {
  id?: number | null;
  name?: string | null;
  deletionDate?: Date | null;
}

export class DeletePublisher implements Service<ServiceInput<DeletePublisherInputParams, void>, DeletePublisherOutput> {
  public static create(publisherRepository: PublisherRepository) {
    return new DeletePublisher(publisherRepository);
  }

  private constructor(private readonly publisherRepository: PublisherRepository) {}

  public async handler(input: ServiceInput<DeletePublisherInputParams, void>): Promise<DeletePublisherOutput> {
    const id = Number(input.params?.id || 0);

    const publisher = id > 0 ? await this.publisherRepository.getById(id) : null;

    if (!publisher) {
      return this.getOutput(null);
    }

    const deletedPublisher = await this.publisherRepository.delete(id);

    return this.getOutput(deletedPublisher);
  }

  private getOutput(publisher?: Publisher | null): DeletePublisherOutput {
    return {
      id: publisher?.id,
      name: publisher?.name,
      deletionDate: publisher?.deletionDate
    };
  }
}
