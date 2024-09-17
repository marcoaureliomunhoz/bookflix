import { BaseController, HandlerProps, HttpMethod } from './controller';
import { Logger } from '@lib/logger';
import { Service, ServiceInput } from '@application/_base/service';
import { InsertBookRentalInputBody, InsertBookRentalOutput } from '@application/book-rentals/insert-book-rental';
import { ListBookRentalsInputQuery, ListBookRentalsOutput } from '@application/book-rentals/list-book-rentals';
import { GetBookRentalByIdInputParams, GetBookRentalByIdOutput } from '@application/book-rentals/get-book-rental-by-id';
import { UpdateBookRentalInputBody, UpdateBookRentalInputParams, UpdateBookRentalOutput } from '@application/book-rentals/update-book-rental';
import { ReturnBookRentalInputParams, ReturnBookRentalOutput } from '@application/book-rentals/return-book-rental';

export class BookRentalsController extends BaseController {
  public static create(
    logger: Logger,
    insertBookRental: Service<ServiceInput<void, InsertBookRentalInputBody>, InsertBookRentalOutput>,
    updateBookRental: Service<ServiceInput<UpdateBookRentalInputParams, UpdateBookRentalInputBody>, UpdateBookRentalOutput>,
    listBookRentals: Service<ServiceInput<void, void, ListBookRentalsInputQuery>, ListBookRentalsOutput>,
    getBookRentalById: Service<ServiceInput<GetBookRentalByIdInputParams, void>, GetBookRentalByIdOutput>,
    returnBookRental: Service<ServiceInput<ReturnBookRentalInputParams, void>, ReturnBookRentalOutput>
  ) {
    return new BookRentalsController(logger, insertBookRental, updateBookRental, listBookRentals, getBookRentalById, returnBookRental);
  }

  private constructor(
    logger: Logger,
    private readonly insertBookRental: Service<ServiceInput<void, InsertBookRentalInputBody>, InsertBookRentalOutput>,
    private readonly updateBookRental: Service<ServiceInput<UpdateBookRentalInputParams, UpdateBookRentalInputBody>, UpdateBookRentalOutput>,
    private readonly listBookRentals: Service<ServiceInput<void, void, ListBookRentalsInputQuery>, ListBookRentalsOutput>,
    private readonly getBookRentalById: Service<ServiceInput<GetBookRentalByIdInputParams, void>, GetBookRentalByIdOutput>,
    private readonly returnBookRental: Service<ServiceInput<ReturnBookRentalInputParams, void>, ReturnBookRentalOutput>
  ) {
    super('book-rentals', logger);

    // GET /
    this.addRoute(
      'get-all',
      HttpMethod.GET,
      '/',
      this.getAll.bind(this),
      'List all book rentals',
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
              className: 'ListBookRentalsOutputItem',
              properties: [
                {
                  propertyName: 'id',
                  type: 'number'
                },
                {
                  propertyName: 'creationDate',
                  type: 'datetime'
                },
                {
                  propertyName: 'maxReturnDate',
                  type: 'datetime'
                },
                {
                  propertyName: 'returnDate',
                  type: 'datetime'
                },
                {
                  propertyName: 'customerId',
                  type: 'number'
                },
                {
                  propertyName: 'bookId',
                  type: 'number'
                },
                {
                  propertyName: 'bookTitle',
                  type: 'string'
                },
                {
                  propertyName: 'customerName',
                  type: 'string'
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
      'Get book rental by id',
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
            propertyName: 'creationDate',
            type: 'datetime'
          },
          {
            propertyName: 'maxReturnDate',
            type: 'datetime'
          },
          {
            propertyName: 'returnDate',
            type: 'datetime'
          },
          {
            propertyName: 'customerId',
            type: 'number'
          },
          {
            propertyName: 'bookId',
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
      'Insert a new book rental',
      {
        type: 'object',
        className: 'InsertBookRentalInputBody',
        properties: [
          {
            propertyName: 'maxReturnDate',
            type: 'string'
          },
          {
            propertyName: 'customerId',
            type: 'number'
          },
          {
            propertyName: 'bookId',
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
            propertyName: 'creationDate',
            type: 'datetime'
          },
          {
            propertyName: 'maxReturnDate',
            type: 'datetime'
          },
          {
            propertyName: 'returnDate',
            type: 'datetime'
          },
          {
            propertyName: 'customerId',
            type: 'number'
          },
          {
            propertyName: 'bookId',
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
      'Update a book rental',
      {
        type: 'object',
        className: 'UpdateBookRentalInputBody',
        properties: [
          {
            propertyName: 'maxReturnDate',
            type: 'string'
          },
          {
            propertyName: 'customerId',
            type: 'number'
          },
          {
            propertyName: 'bookId',
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
            propertyName: 'creationDate',
            type: 'datetime'
          },
          {
            propertyName: 'maxReturnDate',
            type: 'datetime'
          },
          {
            propertyName: 'returnDate',
            type: 'datetime'
          },
          {
            propertyName: 'customerId',
            type: 'number'
          },
          {
            propertyName: 'bookId',
            type: 'number'
          }
        ]
      }
    );

    // PUT /:id/return
    this.addRoute(
      'return',
      HttpMethod.PUT,
      '/:id/return',
      this.return.bind(this),
      'Return a book rental',
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
            propertyName: 'creationDate',
            type: 'datetime'
          },
          {
            propertyName: 'maxReturnDate',
            type: 'datetime'
          },
          {
            propertyName: 'returnDate',
            type: 'datetime'
          },
          {
            propertyName: 'customerId',
            type: 'number'
          },
          {
            propertyName: 'bookId',
            type: 'number'
          }
        ]
      }
    );
  }

  private async getAll(props: HandlerProps<void, void, ListBookRentalsInputQuery>): Promise<ListBookRentalsOutput> {
    const parsedQuery = this.getParsedQuery<ListBookRentalsInputQuery>('get-all', props.query);
    return await this.listBookRentals.handler({ query: parsedQuery });
  }

  private async getById(props: HandlerProps<void, GetBookRentalByIdInputParams>): Promise<GetBookRentalByIdOutput> {
    return await this.getBookRentalById.handler({
      params: { id: +props.params.id }
    });
  }

  private async insert(props: HandlerProps<InsertBookRentalInputBody, void>): Promise<InsertBookRentalOutput> {
    return await this.insertBookRental.handler({
      body: props.body
    });
  }

  private async update(props: HandlerProps<UpdateBookRentalInputBody, UpdateBookRentalInputParams>): Promise<UpdateBookRentalOutput> {
    return await this.updateBookRental.handler({
      params: props.params,
      body: props.body
    });
  }

  private async return(props: HandlerProps<void, ReturnBookRentalInputParams>): Promise<ReturnBookRentalOutput> {
    return await this.returnBookRental.handler({
      params: props.params
    });
  }
}
