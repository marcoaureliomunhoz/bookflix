import { Service, ServiceInput } from '@application/_base/service';
import { CustomerRepository } from '@entities/customers/gateways/customer-repository';
import { Customer } from '@entities/customers/models/customer';

export interface InsertCustomerInputBody {
  name?: string;
}

export interface InsertCustomerOutput {
  id?: number | null;
  name?: string | null;
}

export class InsertCustomer implements Service<ServiceInput<void, InsertCustomerInputBody>, InsertCustomerOutput> {
  public static create(customerRepository: CustomerRepository) {
    return new InsertCustomer(customerRepository);
  }

  private constructor(private readonly customerRepository: CustomerRepository) {}

  public async handler(input: ServiceInput<void, InsertCustomerInputBody>): Promise<InsertCustomerOutput> {
    const customer = Customer.create(input.body!.name);

    const insertedCustomer = await this.customerRepository.insert(customer);

    return this.getOutput(insertedCustomer);
  }

  private getOutput(customer?: Customer | null): InsertCustomerOutput {
    return {
      id: customer?.id,
      name: customer?.name
    };
  }
}
