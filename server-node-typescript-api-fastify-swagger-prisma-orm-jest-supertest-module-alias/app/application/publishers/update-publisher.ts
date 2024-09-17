import { Service, ServiceInput } from '@application/_base/service';
import { PublisherRepository } from '@entities/publishers/gateways/publisher-repository';
import { Publisher } from '@entities/publishers/models/publisher';

export interface UpdatePublisherInputParams {
  id?: number | null;
}

export interface UpdatePublisherInputBody {
  name?: string;
}

export interface UpdatePublisherOutput {
  id?: number | null;
  name?: string | null;
}

export class UpdatePublisher implements Service<ServiceInput<UpdatePublisherInputParams, UpdatePublisherInputBody>, UpdatePublisherOutput> {
  public static create(publisherRepository: PublisherRepository) {
    return new UpdatePublisher(publisherRepository);
  }

  private constructor(private readonly publisherRepository: PublisherRepository) {}

  public async handler(input: ServiceInput<UpdatePublisherInputParams, UpdatePublisherInputBody>): Promise<UpdatePublisherOutput> {
    const id = Number(input.params?.id || 0);

    const publisher = id > 0 ? await this.publisherRepository.getById(id) : null;

    if (!publisher) {
      return this.getOutput(null);
    }

    publisher.update(input.body?.name);

    const updatedPublisher = await this.publisherRepository.update(publisher);

    return this.getOutput(updatedPublisher);
  }

  private getOutput(publisher?: Publisher | null): UpdatePublisherOutput {
    return {
      id: publisher?.id,
      name: publisher?.name
    };
  }
}
