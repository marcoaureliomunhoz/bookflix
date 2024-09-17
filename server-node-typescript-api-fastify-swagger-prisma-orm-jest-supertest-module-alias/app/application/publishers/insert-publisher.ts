import { Service, ServiceInput } from '@application/_base/service';
import { PublisherRepository } from '@entities/publishers/gateways/publisher-repository';
import { Publisher } from '@entities/publishers/models/publisher';

export interface InsertPublisherInputBody {
  name?: string;
}

export interface InsertPublisherOutput {
  id?: number | null;
  name?: string | null;
}

export class InsertPublisher implements Service<ServiceInput<void, InsertPublisherInputBody>, InsertPublisherOutput> {
  public static create(publisherRepository: PublisherRepository) {
    return new InsertPublisher(publisherRepository);
  }

  private constructor(private readonly publisherRepository: PublisherRepository) {}

  public async handler(input: ServiceInput<void, InsertPublisherInputBody>): Promise<InsertPublisherOutput> {
    const publisher = Publisher.create(input.body!.name);

    const insertedPublisher = await this.publisherRepository.insert(publisher);

    return this.getOutput(insertedPublisher);
  }

  private getOutput(publisher?: Publisher | null): InsertPublisherOutput {
    return {
      id: publisher?.id,
      name: publisher?.name
    };
  }
}
