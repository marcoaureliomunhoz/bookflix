import { Customer } from '../models/customer';

export interface CustomerRepository {
  insert(customer: Customer): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  list(includes?: number[], page?: number | null, pageSize?: number | null): Promise<Customer[]>;
  count(): Promise<number>;
  getById(id: number): Promise<Customer | null | undefined>;
  delete(id: number): Promise<Customer>;
}
