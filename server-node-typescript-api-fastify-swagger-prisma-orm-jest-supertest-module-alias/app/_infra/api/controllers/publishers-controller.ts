import { BaseController, HandlerProps, HttpMethod } from './controller';
import { Logger } from '@lib/logger';
import { Service, ServiceInput } from '@application/_base/service';
import { InsertPublisherInputBody, InsertPublisherOutput } from '@application/publishers/insert-publisher';
import { ListPublishersInputQuery, ListPublishersOutput } from '@application/publishers/list-publishers';
import { GetPublisherByIdInputParams, GetPublisherByIdOutput } from '@application/publishers/get-publisher-by-id';
import { UpdatePublisherInputBody, UpdatePublisherInputParams, UpdatePublisherOutput } from '@application/publishers/update-publisher';
import { DeletePublisherInputParams, DeletePublisherOutput } from '@application/publishers/delete-publisher';

export class PublishersController extends BaseController {
  public static create(
    logger: Logger,
    insertPublisher: Service<ServiceInput<void, InsertPublisherInputBody>, InsertPublisherOutput>,
    updatePublisher: Service<ServiceInput<UpdatePublisherInputParams, UpdatePublisherInputBody>, UpdatePublisherOutput>,
    listPublishers: Service<ServiceInput<void, void, ListPublishersInputQuery>, ListPublishersOutput>,
    getPublisherById: Service<ServiceInput<GetPublisherByIdInputParams, void>, GetPublisherByIdOutput>,
    deletePublisher: Service<ServiceInput<DeletePublisherInputParams, void>, DeletePublisherOutput>
  ) {
    return new PublishersController(logger, insertPublisher, updatePublisher, listPublishers, getPublisherById, deletePublisher);
  }

  private constructor(
    logger: Logger,
    private readonly insertPublisher: Service<ServiceInput<void, InsertPublisherInputBody>, InsertPublisherOutput>,
    private readonly updatePublisher: Service<ServiceInput<UpdatePublisherInputParams, UpdatePublisherInputBody>, UpdatePublisherOutput>,
    private readonly listPublishers: Service<ServiceInput<void, void, ListPublishersInputQuery>, ListPublishersOutput>,
    private readonly getPublisherById: Service<ServiceInput<GetPublisherByIdInputParams, void>, GetPublisherByIdOutput>,
    private readonly deletePublisher: Service<ServiceInput<DeletePublisherInputParams, void>, DeletePublisherOutput>
  ) {
    super('publishers', logger);

    // GET /
    this.addRoute(
      'get-all',
      HttpMethod.GET,
      '/',
      this.getAll.bind(this),
      'List all publishers',
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
              className: 'ListPublishersOutputItem',
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
      'Get publisher by id',
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
      'Insert a new publisher',
      {
        type: 'object',
        className: 'InsertPublisherInputBody',
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
      'Update a publishers',
      {
        type: 'object',
        className: 'UpdatePublisherInputBody',
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
      'Update a publishers',
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

  private async getAll(props: HandlerProps<void, void, ListPublishersInputQuery>): Promise<ListPublishersOutput> {
    const parsedQuery = this.getParsedQuery<ListPublishersInputQuery>('get-all', props.query);
    return await this.listPublishers.handler({ query: parsedQuery });
  }

  private async getById(props: HandlerProps<void, GetPublisherByIdInputParams>): Promise<GetPublisherByIdOutput> {
    return await this.getPublisherById.handler({
      params: { id: +props.params.id }
    });
  }

  private async insert(props: HandlerProps<InsertPublisherInputBody, void>): Promise<InsertPublisherOutput> {
    return await this.insertPublisher.handler({
      body: props.body
    });
  }

  private async update(props: HandlerProps<UpdatePublisherInputBody, UpdatePublisherInputParams>): Promise<UpdatePublisherOutput> {
    return await this.updatePublisher.handler({
      params: props.params,
      body: props.body
    });
  }

  private async delete(props: HandlerProps<void, DeletePublisherInputParams>): Promise<DeletePublisherOutput> {
    return await this.deletePublisher.handler({
      params: { id: +(props.params.id || 0) }
    });
  }
}
