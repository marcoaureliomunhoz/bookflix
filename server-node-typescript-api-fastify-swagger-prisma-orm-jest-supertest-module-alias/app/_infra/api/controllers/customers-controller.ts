import { BaseController, HandlerProps, HttpMethod } from './controller';
import { Logger } from '@lib/logger';
import { Service, ServiceInput } from '@application/_base/service';
import { InsertCustomerInputBody, InsertCustomerOutput } from '@application/customers/insert-customer';
import { ListCustomersInputQuery, ListCustomersOutput } from '@application/customers/list-customers';
import { GetCustomerByIdInputParams, GetCustomerByIdOutput } from '@application/customers/get-customer-by-id';
import { UpdateCustomerInputBody, UpdateCustomerInputParams, UpdateCustomerOutput } from '@application/customers/update-customer';
import { DeleteCustomerInputParams, DeleteCustomerOutput } from '@application/customers/delete-customer';

export class CustomersController extends BaseController {
  public static create(
    logger: Logger,
    insertCustomer: Service<ServiceInput<void, InsertCustomerInputBody>, InsertCustomerOutput>,
    updateCustomer: Service<ServiceInput<UpdateCustomerInputParams, UpdateCustomerInputBody>, UpdateCustomerOutput>,
    listCustomers: Service<ServiceInput<void, void, ListCustomersInputQuery>, ListCustomersOutput>,
    getCustomerById: Service<ServiceInput<GetCustomerByIdInputParams, void>, GetCustomerByIdOutput>,
    deleteCustomer: Service<ServiceInput<DeleteCustomerInputParams, void>, DeleteCustomerOutput>
  ) {
    return new CustomersController(logger, insertCustomer, updateCustomer, listCustomers, getCustomerById, deleteCustomer);
  }

  private constructor(
    logger: Logger,
    private readonly insertCustomer: Service<ServiceInput<void, InsertCustomerInputBody>, InsertCustomerOutput>,
    private readonly updateCustomer: Service<ServiceInput<UpdateCustomerInputParams, UpdateCustomerInputBody>, UpdateCustomerOutput>,
    private readonly listCustomers: Service<ServiceInput<void, void, ListCustomersInputQuery>, ListCustomersOutput>,
    private readonly getCustomerById: Service<ServiceInput<GetCustomerByIdInputParams, void>, GetCustomerByIdOutput>,
    private readonly deleteCustomer: Service<ServiceInput<DeleteCustomerInputParams, void>, DeleteCustomerOutput>
  ) {
    super('customers', logger);

    // GET /
    this.addRoute(
      'get-all',
      HttpMethod.GET,
      '/',
      this.getAll.bind(this),
      'List all customers',
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
              className: 'ListCustomersOutputItem',
              properties: [
                {
                  propertyName: 'id',
                  type: 'number'
                },
                {
                  propertyName: 'name',
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
            paramName: 'includes',
            type: 'array',
            arrayItemsType: 'number'
          },
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
      'Get customer by id',
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
            propertyName: 'name',
            type: 'string'
          },
          {
            propertyName: 'deletionDate',
            type: 'datetime'
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
      'Insert a new customer',
      {
        type: 'object',
        className: 'InsertCustomerInputBody',
        properties: [
          {
            propertyName: 'name',
            type: 'string'
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
            propertyName: 'name',
            type: 'string'
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
      'Update a customers',
      {
        type: 'object',
        className: 'UpdateCustomerInputBody',
        properties: [
          {
            propertyName: 'name',
            type: 'string'
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
            propertyName: 'name',
            type: 'string'
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
      'Update a customers',
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
            propertyName: 'name',
            type: 'string'
          },
          {
            propertyName: 'deletionDate',
            type: 'datetime'
          }
        ]
      }
    );
  }

  private async getAll(props: HandlerProps<void, void, ListCustomersInputQuery>): Promise<ListCustomersOutput> {
    const parsedQuery = this.getParsedQuery<ListCustomersInputQuery>('get-all', props.query);
    return await this.listCustomers.handler({ query: parsedQuery });
  }

  private async getById(props: HandlerProps<void, GetCustomerByIdInputParams>): Promise<GetCustomerByIdOutput> {
    return await this.getCustomerById.handler({
      params: { id: +props.params.id }
    });
  }

  private async insert(props: HandlerProps<InsertCustomerInputBody, void>): Promise<InsertCustomerOutput> {
    return await this.insertCustomer.handler({
      body: props.body
    });
  }

  private async update(props: HandlerProps<UpdateCustomerInputBody, UpdateCustomerInputParams>): Promise<UpdateCustomerOutput> {
    return await this.updateCustomer.handler({
      params: props.params,
      body: props.body
    });
  }

  private async delete(props: HandlerProps<void, DeleteCustomerInputParams>): Promise<DeleteCustomerOutput> {
    return await this.deleteCustomer.handler({
      params: { id: +(props.params.id || 0) }
    });
  }
}
