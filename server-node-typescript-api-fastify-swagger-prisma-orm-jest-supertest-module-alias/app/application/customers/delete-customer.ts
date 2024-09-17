import { Service, ServiceInput } from '@application/_base/service';
import { CustomerRepository } from '@entities/customers/gateways/customer-repository';
import { Customer } from '@entities/customers/models/customer';

export interface DeleteCustomerInputParams {
  id?: number | null;
}

export interface DeleteCustomerOutput {
  id?: number | null;
  name?: string | null;
  deletionDate?: Date | null;
}

export class DeleteCustomer implements Service<ServiceInput<DeleteCustomerInputParams, void>, DeleteCustomerOutput> {
  public static create(customerRepository: CustomerRepository) {
    return new DeleteCustomer(customerRepository);
  }

  private constructor(private readonly customerRepository: CustomerRepository) {}

  public async handler(input: ServiceInput<DeleteCustomerInputParams, void>): Promise<DeleteCustomerOutput> {
    const id = Number(input.params?.id || 0);

    const customer = id > 0 ? await this.customerRepository.getById(id) : null;

    if (!customer) {
      return this.getOutput(null);
    }

    const deletedCustomer = await this.customerRepository.delete(id);

    return this.getOutput(deletedCustomer);
  }

  private getOutput(customer?: Customer | null): DeleteCustomerOutput {
    return {
      id: customer?.id,
      name: customer?.name,
      deletionDate: customer?.deletionDate
    };
  }
}
