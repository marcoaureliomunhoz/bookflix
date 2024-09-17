import { Service, ServiceInput } from '@application/_base/service';
import { CustomerRepository } from '@entities/customers/gateways/customer-repository';
import { Customer } from '@entities/customers/models/customer';
import { Pagination } from '../_base/pagination';

export interface ListCustomersInputQuery {
  includes?: number[];
  page?: number | null;
  pageSize?: number | null;
}

export interface ListCustomersOutput {
  list: {
    id: number;
    name: string;
    deletionDate?: Date | null;
  }[];
  pagination: Pagination;
}

export class ListCustomers implements Service<ServiceInput<void, void, ListCustomersInputQuery>, ListCustomersOutput> {
  public static create(customerRepository: CustomerRepository) {
    return new ListCustomers(customerRepository);
  }

  private constructor(private readonly customerRepository: CustomerRepository) {}

  public async handler(input: ServiceInput<void, void, ListCustomersInputQuery>): Promise<ListCustomersOutput> {
    console.log('ListCustomers:', input.query?.includes);
    const list = await this.customerRepository.list(input.query?.includes, input.query?.page, input.query?.pageSize);
    return this.getOutput(list, input);
  }

  private async getOutput(list?: Customer[] | null, input?: ServiceInput<void, void, ListCustomersInputQuery> | null): Promise<ListCustomersOutput> {
    return {
      list:
        list?.map((customer) => ({
          id: customer.id,
          name: customer.name,
          deletionDate: customer.deletionDate
        })) || [],
      pagination: await this.getPagination(list, input)
    };
  }

  private async getPagination(list?: Customer[] | null, input?: ServiceInput<void, void, ListCustomersInputQuery> | null): Promise<Pagination> {
    const pageSize = input?.query?.pageSize ?? 0;
    const count = pageSize > 0 ? await this.customerRepository.count() : list?.length;
    return Pagination.create(input?.query?.page, pageSize, count);
  }
}
