import { PublisherRepositoryPrisma } from '@infra/data/repositories/publisher-repository-prisma';
import { PrismaDbContext } from '@infra/data/repositories/prisma-db-context';
import { MockPrismaDbContext } from '@infra/data/repositories/prisma-db-context-mock';
import { InsertPublisher, InsertPublisherInputBody } from '@application/publishers/insert-publisher';

describe('Insert Publisher Service', () => {
  let mockDbContext: MockPrismaDbContext;
  let dbContext: PrismaDbContext;
  let insertPublisher: InsertPublisher;
  let publisherRepository: PublisherRepositoryPrisma;

  beforeAll(() => {
    mockDbContext = new MockPrismaDbContext();
    dbContext = mockDbContext as unknown as PrismaDbContext;
    publisherRepository = PublisherRepositoryPrisma.create(dbContext);
    insertPublisher = InsertPublisher.create(publisherRepository);
  });

  it('should return the inserted publisher', async () => {
    const body: InsertPublisherInputBody = {
      name: `test ${new Date().toDateString()}`
    };
    mockDbContext.instance?.publisher.create.mockResolvedValue({
      publisher_id: Math.floor(Math.random() * 101),
      name: body.name!,
      deletion_date: null
    });

    const output = await insertPublisher.handler({
      body
    });

    console.log('expected values:', body);

    expect(output.name).toEqual(body.name);
  });

  it('should throw exception for publisher with short name', () => {
    const body: InsertPublisherInputBody = {
      name: 'ab'
    };

    expect(async () => {
      await insertPublisher.handler({ body });
    }).rejects.toThrow();
  });
});
