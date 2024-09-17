import { Service, ServiceInput } from '@application/_base/service';
import { CustomerRepository } from '@entities/customers/gateways/customer-repository';
import { Customer } from '@entities/customers/models/customer';
import { Logger } from '@lib/logger';

export interface GetCustomerByIdInputParams {
  id: number;
}

export type GetCustomerByIdOutput = {
  id?: number | null;
  name?: string | null;
  deletionDate?: Date | null;
};

export class GetCustomerById implements Service<ServiceInput<GetCustomerByIdInputParams, void>, GetCustomerByIdOutput> {
  public static create(customerRepository: CustomerRepository, logger: Logger) {
    return new GetCustomerById(customerRepository, logger);
  }

  private constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly logger: Logger
  ) {}

  public async handler(input: ServiceInput<GetCustomerByIdInputParams, void>): Promise<GetCustomerByIdOutput> {
    this.logger.info('GetCustomerById - input:', input);
    const customer = await this.customerRepository.getById(input.params!.id);

    return this.getOutput(customer);
  }

  private getOutput(customer?: Customer | null): GetCustomerByIdOutput {
    return {
      id: customer?.id,
      name: customer?.name,
      deletionDate: customer?.deletionDate
    };
  }
}
