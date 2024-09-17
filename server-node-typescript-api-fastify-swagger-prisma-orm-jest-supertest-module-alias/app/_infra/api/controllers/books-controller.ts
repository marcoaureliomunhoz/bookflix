import { BaseController, HandlerProps, HttpMethod } from './controller';
import { Logger } from '@lib/logger';
import { Service, ServiceInput } from '@application/_base/service';
import { InsertBookInputBody, InsertBookOutput } from '@application/books/insert-book';
import { ListBooksInputQuery, ListBooksOutput } from '@application/books/list-books';
import { GetBookByIdInputParams, GetBookByIdOutput } from '@application/books/get-book-by-id';
import { UpdateBookInputBody, UpdateBookInputParams, UpdateBookOutput } from '@application/books/update-book';
import { DeleteBookInputParams, DeleteBookOutput } from '@application/books/delete-book';

export class BooksController extends BaseController {
  public static create(
    logger: Logger,
    insertBook: Service<ServiceInput<void, InsertBookInputBody>, InsertBookOutput>,
    updateBook: Service<ServiceInput<UpdateBookInputParams, UpdateBookInputBody>, UpdateBookOutput>,
    listBooks: Service<ServiceInput<void, void, ListBooksInputQuery>, ListBooksOutput>,
    getBookById: Service<ServiceInput<GetBookByIdInputParams, void>, GetBookByIdOutput>,
    deleteBook: Service<ServiceInput<DeleteBookInputParams, void>, DeleteBookOutput>
  ) {
    return new BooksController(logger, insertBook, updateBook, listBooks, getBookById, deleteBook);
  }

  private constructor(
    logger: Logger,
    private readonly insertBook: Service<ServiceInput<void, InsertBookInputBody>, InsertBookOutput>,
    private readonly updateBook: Service<ServiceInput<UpdateBookInputParams, UpdateBookInputBody>, UpdateBookOutput>,
    private readonly listBooks: Service<ServiceInput<void, void, ListBooksInputQuery>, ListBooksOutput>,
    private readonly getBookById: Service<ServiceInput<GetBookByIdInputParams, void>, GetBookByIdOutput>,
    private readonly deleteBook: Service<ServiceInput<DeleteBookInputParams, void>, DeleteBookOutput>
  ) {
    super('books', logger);

    // GET /
    this.addRoute(
      'get-all',
      HttpMethod.GET,
      '/',
      this.getAll.bind(this),
      'List all books',
      {
        type: 'void'
      },
      {
        type: 'object',
        properties: [
          {
            propertyName: 'list',
            type: 'array',
            items: {
              className: 'ListBooksOutputItem',
              properties: [
                {
                  propertyName: 'id',
                  type: 'number'
                },
                {
                  propertyName: 'title',
                  type: 'string'
                },
                {
                  propertyName: 'publisherId',
                  type: 'number'
                },
                {
                  propertyName: 'quantity',
                  type: 'number'
                },
                {
                  propertyName: 'maxRentalDays',
                  type: 'number'
                },
                {
                  propertyName: 'numberOfRentals',
                  type: 'number'
                },
                {
                  propertyName: 'numberOfReturns',
                  type: 'number'
                }
              ]
            }
          },
          {
            propertyName: 'pagination',
            type: 'object',
            properties: [
              {
                propertyName: 'page',
                type: 'number'
              },
              {
                propertyName: 'pageSize',
                type: 'number'
              },
              {
                propertyName: 'listSize',
                type: 'number'
              },
              {
                propertyName: 'numberOfPages',
                type: 'number'
              }
            ]
          }
        ]
      },
      {
        properties: [
          {
            paramName: 'page',
            type: 'number'
          },
          {
            paramName: 'pageSize',
            type: 'number'
          }
        ]
      }
    );

    // GET /:id
    this.addRoute(
      'get-by-id',
      HttpMethod.GET,
      '/:id',
      this.getById.bind(this),
      'Get book by id',
      {
        type: 'void'
      },
      {
        type: 'object',
        properties: [
          {
            propertyName: 'id',
            type: 'number'
          },
          {
            propertyName: 'title',
            type: 'string'
          },
          {
            propertyName: 'deletionDate',
            type: 'datetime'
          },
          {
            propertyName: 'publisherId',
            type: 'number'
          },
          {
            propertyName: 'quantity',
            type: 'number'
          },
          {
            propertyName: 'maxRentalDays',
            type: 'number'
          },
          {
            propertyName: 'numberOfRentals',
            type: 'number'
          },
          {
            propertyName: 'numberOfReturns',
            type: 'number'
          }
        ]
      }
    );

    // POST /
    this.addRoute(
      'post',
      HttpMethod.POST,
      '/',
      this.insert.bind(this),
      'Insert a new book',
      {
        type: 'object',
        className: 'InsertBookInputBody',
        properties: [
          {
            propertyName: 'title',
            type: 'string'
          },
          {
            propertyName: 'publisherId',
            type: 'number'
          },
          {
            propertyName: 'quantity',
            type: 'number'
          },
          {
            propertyName: 'maxRentalDays',
            type: 'number'
          }
        ]
      },
      {
        type: 'object',
        properties: [
          {
            propertyName: 'id',
            type: 'number'
          },
          {
            propertyName: 'title',
            type: 'string'
          },
          {
            propertyName: 'publisherId',
            type: 'number'
          },
          {
            propertyName: 'quantity',
            type: 'number'
          },
          {
            propertyName: 'maxRentalDays',
            type: 'number'
          },
          {
            propertyName: 'numberOfRentals',
            type: 'number'
          },
          {
            propertyName: 'numberOfReturns',
            type: 'number'
          }
        ]
      }
    );

    // PUT /:id
    this.addRoute(
      'put',
      HttpMethod.PUT,
      '/:id',
      this.update.bind(this),
      'Update a books',
      {
        type: 'object',
        className: 'UpdateBookInputBody',
        properties: [
          {
            propertyName: 'title',
            type: 'string'
          },
          {
            propertyName: 'publisherId',
            type: 'number'
          },
          {
            propertyName: 'quantity',
            type: 'number'
          },
          {
            propertyName: 'maxRentalDays',
            type: 'number'
          }
        ]
      },
      {
        type: 'object',
        properties: [
          {
            propertyName: 'id',
            type: 'number'
          },
          {
            propertyName: 'title',
            type: 'string'
          },
          {
            propertyName: 'publisherId',
            type: 'number'
          },
          {
            propertyName: 'quantity',
            type: 'number'
          },
          {
            propertyName: 'maxRentalDays',
            type: 'number'
          },
          {
            propertyName: 'numberOfRentals',
            type: 'number'
          },
          {
            propertyName: 'numberOfReturns',
            type: 'number'
          }
        ]
      }
    );

    // DELETE /:id
    this.addRoute(
      'delete',
      HttpMethod.DELETE,
      '/:id',
      this.delete.bind(this),
      'Update a books',
      {
        type: 'void'
      },
      {
        type: 'object',
        properties: [
          {
            propertyName: 'id',
            type: 'number'
          },
          {
            propertyName: 'title',
            type: 'string'
          },
          {
            propertyName: 'deletionDate',
            type: 'datetime'
          },
          {
            propertyName: 'publisherId',
            type: 'number'
          },
          {
            propertyName: 'quantity',
            type: 'number'
          },
          {
            propertyName: 'maxRentalDays',
            type: 'number'
          },
          {
            propertyName: 'numberOfRentals',
            type: 'number'
          },
          {
            propertyName: 'numberOfReturns',
            type: 'number'
          }
        ]
      }
    );
  }

  private async getAll(props: HandlerProps<void, void, ListBooksInputQuery>): Promise<ListBooksOutput> {
    const parsedQuery = this.getParsedQuery<ListBooksInputQuery>('get-all', props.query);
    return await this.listBooks.handler({ query: parsedQuery });
  }

  private async getById(props: HandlerProps<void, GetBookByIdInputParams>): Promise<GetBookByIdOutput> {
    return await this.getBookById.handler({
      params: { id: +props.params.id }
    });
  }

  private async insert(props: HandlerProps<InsertBookInputBody, void>): Promise<InsertBookOutput> {
    return await this.insertBook.handler({
      body: props.body
    });
  }

  private async update(props: HandlerProps<UpdateBookInputBody, UpdateBookInputParams>): Promise<UpdateBookOutput> {
    return await this.updateBook.handler({
      params: props.params,
      body: props.body
    });
  }

  private async delete(props: HandlerProps<void, DeleteBookInputParams>): Promise<DeleteBookOutput> {
    return await this.deleteBook.handler({
      params: { id: +(props.params.id || 0) }
    });
  }
}
