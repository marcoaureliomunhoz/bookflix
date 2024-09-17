import { CustomerRepositoryPrisma } from '@app/_infra/data/repositories/customer-repository-prisma';
import { PrismaDbContext } from '@app/_infra/data/repositories/prisma-db-context';
import { GetCustomerById } from '@app/application/customers/get-customer-by-id';
import { Logger } from '@app/lib/logger';
// import { mock, MockProxy } from 'jest-mock-extended';

console.log('process?.env?.ENV_FILE:', process?.env?.ENV_FILE);
const envFileIncludesTestAndDocker = (process?.env?.ENV_FILE || '').includes('test') && (process?.env?.ENV_FILE || '').includes('docker');
console.log('envFileIncludesTestAndDocker:', envFileIncludesTestAndDocker);

if (envFileIncludesTestAndDocker) {
  describe('Get Customer by Id Service', () => {
    // let loggerMock: MockProxy<Logger>;
    const logger = Logger.create();
    let dbContext: PrismaDbContext;
    let customerRepository: CustomerRepositoryPrisma;
    let getCustomerById: GetCustomerById;

    beforeAll(async () => {
      // loggerMock = mock();
      dbContext = new PrismaDbContext();
      customerRepository = CustomerRepositoryPrisma.create(dbContext);
      getCustomerById = GetCustomerById.create(customerRepository, logger);

      const cnn = await dbContext.connect();
      await cnn.$executeRaw`alter table customer AUTO_INCREMENT = 0`;
      await cnn.customer.createMany({
        data: [{ name: 'customer test a1', deletion_date: null }]
      });
    });

    afterAll(async () => {
      const cnn = await dbContext.connect();
      const deleteCustomer = cnn.customer.deleteMany();
      await cnn.$transaction([deleteCustomer]);
      await dbContext.disconnect();
    });

    it('should return expected customer', async () => {
      const output = await getCustomerById.handler({
        params: {
          id: 1
        }
      });

      console.log('output:', output);

      expect(output).toEqual({
        id: 1,
        name: 'customer test a1',
        deletionDate: null
      });
    });
  });
} else {
  describe('Get Customer by Id Service', () => {
    it('test', () => {});
  });
}
