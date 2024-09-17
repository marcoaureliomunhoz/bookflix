import { Service, ServiceInput } from '@application/_base/service';
import { PublisherRepository } from '@entities/publishers/gateways/publisher-repository';
import { Publisher } from '@entities/publishers/models/publisher';
import { Pagination } from '../_base/pagination';

export interface ListPublishersInputQuery {
  includes?: number[];
  page?: number | null;
  pageSize?: number | null;
}

export interface ListPublishersOutput {
  list: {
    id: number;
    name: string;
    deletionDate?: Date | null;
  }[];
  pagination: Pagination;
}

export class ListPublishers implements Service<ServiceInput<void, void, ListPublishersInputQuery>, ListPublishersOutput> {
  public static create(publisherRepository: PublisherRepository) {
    return new ListPublishers(publisherRepository);
  }

  private constructor(private readonly publisherRepository: PublisherRepository) {}

  public async handler(input: ServiceInput<void, void, ListPublishersInputQuery>): Promise<ListPublishersOutput> {
    console.log('ListPublishers:', input.query?.includes);
    const list = await this.publisherRepository.list(input.query?.includes, input.query?.page, input.query?.pageSize);
    return this.getOutput(list, input);
  }

  private async getOutput(list?: Publisher[] | null, input?: ServiceInput<void, void, ListPublishersInputQuery> | null): Promise<ListPublishersOutput> {
    return {
      list:
        list?.map((publisher) => ({
          id: publisher.id,
          name: publisher.name,
          deletionDate: publisher.deletionDate
        })) || [],
      pagination: await this.getPagination(list, input)
    };
  }

  private async getPagination(list?: Publisher[] | null, input?: ServiceInput<void, void, ListPublishersInputQuery> | null): Promise<Pagination> {
    const pageSize = input?.query?.pageSize ?? 0;
    const count = pageSize > 0 ? await this.publisherRepository.count() : list?.length;
    return Pagination.create(input?.query?.page, pageSize, count);
  }
}
