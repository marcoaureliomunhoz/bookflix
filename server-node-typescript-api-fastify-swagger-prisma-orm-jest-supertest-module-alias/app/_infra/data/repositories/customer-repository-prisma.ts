import { PrismaDbContext } from './prisma-db-context';
import { CustomerRepository } from '@entities/customers/gateways/customer-repository';
import { Customer } from '@entities/customers/models/customer';

export class CustomerRepositoryPrisma implements CustomerRepository {
  private constructor(private readonly db: PrismaDbContext) {}

  public static create(db: PrismaDbContext) {
    return new CustomerRepositoryPrisma(db);
  }

  private createCustomerFromModel(model: any): Customer {
    return Customer.createFromProps({
      id: model.customer_id,
      name: model.name,
      deletionDate: model.deletion_date
    });
  }

  public async insert(customer: Customer): Promise<Customer> {
    const cnn = await this.db.connect();
    const data = {
      name: customer.name
    };
    const newData = await cnn.customer.create({ data });
    return this.createCustomerFromModel(newData);
  }

  public async update(customer: Customer): Promise<Customer> {
    const cnn = await this.db.connect();
    const data = {
      name: customer.name
    };
    const newData = await cnn.customer.update({ data, where: { customer_id: customer.id } });
    return this.createCustomerFromModel(newData);
  }

  public async list(includes?: number[], page?: number | null, pageSize?: number | null): Promise<Customer[]> {
    const pageNumber = page && page > 0 ? page - 1 : 0;
    const cnn = await this.db.connect();
    const data = await cnn.customer.findMany({
      where: {
        OR: [
          {
            deletion_date: null
          },
          {
            customer_id: {
              in: includes || []
            }
          }
        ]
      },
      take: pageSize && pageSize > 0 ? pageSize : undefined,
      skip: pageSize && pageSize > 0 ? pageNumber * pageSize : 0
    });
    return data.map((dv) => {
      return this.createCustomerFromModel(dv);
    });
  }

  public async count(): Promise<number> {
    const cnn = await this.db.connect();
    const data = await cnn.customer.count();
    return data;
  }

  public async getById(id: number): Promise<Customer | null | undefined> {
    const cnn = await this.db.connect();
    const data = await cnn.customer.findFirst({
      where: {
        customer_id: id
      }
    });
    return data ? this.createCustomerFromModel(data) : null;
  }

  public async delete(id: number): Promise<Customer> {
    const numberOfBookRentals = await this.countBookRentals(id);
    const cnn = await this.db.connect();
    if (numberOfBookRentals > 0) {
      const data = await cnn.customer.update({
        data: {
          deletion_date: new Date()
        },
        where: {
          customer_id: id
        }
      });
      return this.createCustomerFromModel(data);
    }
    const data = await cnn.customer.delete({
      where: {
        customer_id: id
      }
    });
    return this.createCustomerFromModel(data);
  }

  private async countBookRentals(customerId: number): Promise<number> {
    const cnn = await this.db.connect();
    const data = await cnn.bookRental.count({
      where: {
        customer_id: customerId
      }
    });
    return data;
  }
}
