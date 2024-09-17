import { CustomerRepositoryPrisma } from '@app/_infra/data/repositories/customer-repository-prisma';
import { PrismaDbContext } from '@app/_infra/data/repositories/prisma-db-context';
import { ListCustomers } from '@app/application/customers/list-customers';

console.log('process?.env?.ENV_FILE:', process?.env?.ENV_FILE);
const envFileIncludesTestAndDocker = (process?.env?.ENV_FILE || '').includes('test') && (process?.env?.ENV_FILE || '').includes('docker');
console.log('envFileIncludesTestAndDocker:', envFileIncludesTestAndDocker);

if (envFileIncludesTestAndDocker) {
  describe('List Customer by Id Service', () => {
    let dbContext: PrismaDbContext;
    let customerRepository: CustomerRepositoryPrisma;
    let listCustomers: ListCustomers;

    beforeAll(async () => {
      dbContext = new PrismaDbContext();
      customerRepository = CustomerRepositoryPrisma.create(dbContext);
      listCustomers = ListCustomers.create(customerRepository);

      const cnn = await dbContext.connect();
      await cnn.$executeRaw`alter table customer AUTO_INCREMENT = 0`;
      await cnn.customer.createMany({
        data: [
          { name: 'list customer test 1', deletion_date: null },
          { name: 'list customer test 2', deletion_date: null }
        ]
      });
    });

    afterAll(async () => {
      const cnn = await dbContext.connect();
      const deleteCustomer = cnn.customer.deleteMany();
      await cnn.$transaction([deleteCustomer]);
      await dbContext.disconnect();
    });

    it('should return expected list', async () => {
      const output = await listCustomers.handler({});

      console.log('output:', output);

      expect(output.pagination.listSize).toEqual(2);
    });
  });
} else {
  describe('List Customer by Id Service', () => {
    it('test', () => {});
  });
}
