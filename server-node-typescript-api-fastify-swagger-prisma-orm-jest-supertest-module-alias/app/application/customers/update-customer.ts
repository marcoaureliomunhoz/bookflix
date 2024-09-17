import { Service, ServiceInput } from '@application/_base/service';
import { CustomerRepository } from '@entities/customers/gateways/customer-repository';
import { Customer } from '@entities/customers/models/customer';

export interface UpdateCustomerInputParams {
  id?: number | null;
}

export interface UpdateCustomerInputBody {
  name?: string;
}

export interface UpdateCustomerOutput {
  id?: number | null;
  name?: string | null;
}

export class UpdateCustomer implements Service<ServiceInput<UpdateCustomerInputParams, UpdateCustomerInputBody>, UpdateCustomerOutput> {
  public static create(customerRepository: CustomerRepository) {
    return new UpdateCustomer(customerRepository);
  }

  private constructor(private readonly customerRepository: CustomerRepository) {}

  public async handler(input: ServiceInput<UpdateCustomerInputParams, UpdateCustomerInputBody>): Promise<UpdateCustomerOutput> {
    const id = Number(input.params?.id || 0);

    const customer = id > 0 ? await this.customerRepository.getById(id) : null;

    if (!customer) {
      return this.getOutput(null);
    }

    customer.update(input.body?.name);

    const updatedCustomer = await this.customerRepository.update(customer);

    return this.getOutput(updatedCustomer);
  }

  private getOutput(customer?: Customer | null): UpdateCustomerOutput {
    return {
      id: customer?.id,
      name: customer?.name
    };
  }
}
