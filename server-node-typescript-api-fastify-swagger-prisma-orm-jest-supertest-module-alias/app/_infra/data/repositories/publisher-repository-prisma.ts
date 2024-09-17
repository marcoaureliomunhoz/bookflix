import { PrismaDbContext } from './prisma-db-context';
import { PublisherRepository } from '@entities/publishers/gateways/publisher-repository';
import { Publisher } from '@entities/publishers/models/publisher';

export class PublisherRepositoryPrisma implements PublisherRepository {
  private constructor(private readonly db: PrismaDbContext) {}

  public static create(db: PrismaDbContext) {
    return new PublisherRepositoryPrisma(db);
  }

  private createPublisherFromModel(model: any): Publisher {
    return Publisher.createFromProps({
      id: model.publisher_id,
      name: model.name,
      deletionDate: model.deletion_date
    });
  }

  public async insert(publisher: Publisher): Promise<Publisher> {
    const cnn = await this.db.connect();
    const data = {
      name: publisher.name
    };
    const newData = await cnn.publisher.create({ data });
    return this.createPublisherFromModel(newData);
  }

  public async update(publisher: Publisher): Promise<Publisher> {
    const cnn = await this.db.connect();
    const data = {
      name: publisher.name
    };
    const newData = await cnn.publisher.update({ data, where: { publisher_id: publisher.id } });
    return this.createPublisherFromModel(newData);
  }

  public async count(): Promise<number> {
    const cnn = await this.db.connect();
    const data = await cnn.publisher.count();
    return data;
  }

  public async list(includes?: number[], page?: number | null, pageSize?: number | null): Promise<Publisher[]> {
    const pageNumber = page && page > 0 ? page - 1 : 0;
    const cnn = await this.db.connect();
    const data = await cnn.publisher.findMany({
      where: {
        OR: [
          {
            deletion_date: null
          },
          {
            publisher_id: {
              in: includes || []
            }
          }
        ]
      },
      orderBy: {
        publisher_id: 'asc'
      },
      take: pageSize && pageSize > 0 ? pageSize : undefined,
      skip: pageSize && pageSize > 0 ? pageNumber * pageSize : 0
    });
    return data.map((dv) => {
      return this.createPublisherFromModel(dv);
    });
  }

  public async getById(id: number): Promise<Publisher | null | undefined> {
    const cnn = await this.db.connect();
    const data = await cnn.publisher.findFirst({
      where: {
        publisher_id: id
      }
    });
    return data ? this.createPublisherFromModel(data) : null;
  }

  public async delete(id: number): Promise<Publisher> {
    const numberOfBooks = await this.countBooks(id);
    const cnn = await this.db.connect();
    if (numberOfBooks > 0) {
      const data = await cnn.publisher.update({
        data: {
          deletion_date: new Date()
        },
        where: {
          publisher_id: id
        }
      });
      return this.createPublisherFromModel(data);
    }
    const data = await cnn.publisher.delete({
      where: {
        publisher_id: id
      }
    });
    return this.createPublisherFromModel(data);
  }

  private async countBooks(publisherId: number): Promise<number> {
    const cnn = await this.db.connect();
    const data = await cnn.book.count({
      where: {
        publisher_id: publisherId
      }
    });
    return data;
  }
}
