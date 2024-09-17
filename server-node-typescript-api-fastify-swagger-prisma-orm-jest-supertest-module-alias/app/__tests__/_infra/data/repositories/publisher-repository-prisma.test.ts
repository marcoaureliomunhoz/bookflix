import { PublisherRepositoryPrisma } from '@infra/data/repositories/publisher-repository-prisma';
import { PrismaDbContext } from '@infra/data/repositories/prisma-db-context';
import { MockPrismaDbContext } from '@infra/data/repositories/prisma-db-context-mock';
import { Publisher } from '@prisma/client';

describe('Publisher Repository', () => {
  let mockDbContext: MockPrismaDbContext;
  let dbContext: PrismaDbContext;
  let publisherRepository: PublisherRepositoryPrisma;

  beforeEach(() => {
    mockDbContext = new MockPrismaDbContext();
    dbContext = mockDbContext as unknown as PrismaDbContext;
    publisherRepository = PublisherRepositoryPrisma.create(dbContext);
  });

  it('should delete if the publisher does not have a linked book', async () => {
    mockDbContext.instance?.book.count.mockResolvedValue(0);
    const publisher: Publisher = {
      publisher_id: Math.floor(Math.random() * 101),
      name: `test ${new Date().toDateString()}`,
      deletion_date: null
    };
    mockDbContext.instance?.publisher.delete.mockResolvedValue(publisher);
    mockDbContext.instance?.publisher.update.mockClear();

    const deletedPublisher = await publisherRepository.delete(publisher.publisher_id);

    console.log('expected values:', publisher);

    expect(deletedPublisher.name).toEqual(publisher.name);
    expect(deletedPublisher.deletionDate).toEqual(publisher.deletion_date);
  });

  it('should update if the publisher has a linked book', async () => {
    mockDbContext.instance?.book.count.mockResolvedValue(1);
    const publisher: Publisher = {
      publisher_id: Math.floor(Math.random() * 101),
      name: `test ${new Date().toDateString()}`,
      deletion_date: new Date()
    };
    mockDbContext.instance?.publisher.update.mockResolvedValue(publisher);
    mockDbContext.instance?.publisher.delete.mockClear();

    const deletedPublisher = await publisherRepository.delete(publisher.publisher_id);

    console.log('expected values:', publisher);

    expect(deletedPublisher.name).toEqual(publisher.name);
    expect(deletedPublisher.deletionDate).toEqual(publisher.deletion_date);
  });
});
