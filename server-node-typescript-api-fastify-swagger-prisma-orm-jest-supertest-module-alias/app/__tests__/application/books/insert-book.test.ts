import { BookRepositoryPrisma } from '@infra/data/repositories/book-repository-prisma';
import { PrismaDbContext } from '@infra/data/repositories/prisma-db-context';
import { MockPrismaDbContext } from '@infra/data/repositories/prisma-db-context-mock';
import { InsertBook, InsertBookInputBody } from '@application/books/insert-book';

describe('Insert Book Service', () => {
  let mockDbContext: MockPrismaDbContext;
  let dbContext: PrismaDbContext;
  let insertBook: InsertBook;
  let bookRepository: BookRepositoryPrisma;

  beforeAll(() => {
    mockDbContext = new MockPrismaDbContext();
    dbContext = mockDbContext as unknown as PrismaDbContext;
    bookRepository = BookRepositoryPrisma.create(dbContext);
    insertBook = InsertBook.create(bookRepository);
  });

  it('should return the inserted book', async () => {
    const body: InsertBookInputBody = {
      title: `test ${new Date().toDateString()}`,
      quantity: Math.floor(Math.random() * 101),
      publisherId: Math.floor(Math.random() * 101),
      maxRentalDays: Math.floor(Math.random() * 101)
    };
    mockDbContext.instance?.book.create.mockResolvedValue({
      book_id: 1,
      title: body.title!,
      publisher_id: body.publisherId!,
      quantity: body.quantity!,
      max_rental_days: body.maxRentalDays!,
      number_of_returns: 0,
      number_of_rentals: 0,
      deletion_date: null
    });

    const output = await insertBook.handler({
      body
    });

    console.log('expected values:', body);

    expect(output.title).toEqual(body.title);
    expect(output.quantity).toEqual(body.quantity);
    expect(output.publisherId).toEqual(body.publisherId);
    expect(output.maxRentalDays).toEqual(body.maxRentalDays);
  });

  it('should throw exception for book with short name', () => {
    const body: InsertBookInputBody = {
      title: 'ab',
      quantity: Math.floor(Math.random() * 101),
      publisherId: Math.floor(Math.random() * 101),
      maxRentalDays: Math.floor(Math.random() * 101)
    };

    expect(async () => {
      await insertBook.handler({ body });
    }).rejects.toThrow();
  });
});
