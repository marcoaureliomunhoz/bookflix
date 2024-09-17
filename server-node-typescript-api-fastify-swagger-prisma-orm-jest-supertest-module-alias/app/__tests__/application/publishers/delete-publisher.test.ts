import { mock, MockProxy } from 'jest-mock-extended';
import { PublisherRepositoryPrisma } from '@infra/data/repositories/publisher-repository-prisma';
import { DeletePublisher } from '@application/publishers/delete-publisher';
import { Publisher } from '@entities/publishers/models/publisher';

describe('Delete Publisher Service', () => {
  let deletePublisher: DeletePublisher;
  let publisherRepository: MockProxy<PublisherRepositoryPrisma>;

  beforeAll(() => {
    publisherRepository = mock();
    deletePublisher = DeletePublisher.create(publisherRepository);
  });

  it('should call delete from repository service', async () => {
    const publisher = Publisher.createFromProps({
      id: Math.floor(Math.random() * 101),
      name: `test ${new Date().toDateString()}`,
      deletionDate: null
    });
    publisherRepository.getById.calledWith(publisher.id).mockResolvedValue(publisher);

    await deletePublisher.handler({
      params: {
        id: publisher.id
      }
    });

    expect(publisherRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should not call delete from repository service', async () => {
    const publisherId = Math.floor(Math.random() * 101);
    publisherRepository.getById.calledWith(publisherId).mockResolvedValue(null);

    await deletePublisher.handler({
      params: {
        id: publisherId
      }
    });

    expect(publisherRepository.delete).not.toHaveBeenCalled();
  });
});
