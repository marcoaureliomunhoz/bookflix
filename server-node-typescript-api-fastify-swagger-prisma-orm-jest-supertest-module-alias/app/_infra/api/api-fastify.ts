import '../config/module-alias-config';
import * as http from 'http';
import fastify, { FastifyInstance } from 'fastify';
import { Api } from './api';
import { Controller } from './controllers/controller';
import { PublishersController } from './controllers/publishers-controller';
import { BooksController } from './controllers/books-controller';
import { CustomersController } from './controllers/customers-controller';
import { BookRentalsController } from './controllers/book-rentals-controller';
import { PrismaDbContext } from '../data/repositories/prisma-db-context';
import { PublisherRepositoryPrisma } from '../data/repositories/publisher-repository-prisma';
import { BookRepositoryPrisma } from '../data/repositories/book-repository-prisma';
import { CustomerRepositoryPrisma } from '../data/repositories/customer-repository-prisma';
import { BookRentalRepositoryPrisma } from '../data/repositories/book-rental-repository-prisma';
import { Logger } from '@lib/logger';
import { ListPublishers } from '@application/publishers/list-publishers';
import { GetPublisherById } from '@application/publishers/get-publisher-by-id';
import { InsertPublisher } from '@application/publishers/insert-publisher';
import { UpdatePublisher } from '@application/publishers/update-publisher';
import { DeletePublisher } from '@application/publishers/delete-publisher';
import { ListBooks } from '@application/books/list-books';
import { GetBookById } from '@application/books/get-book-by-id';
import { InsertBook } from '@application/books/insert-book';
import { UpdateBook } from '@application/books/update-book';
import { DeleteBook } from '@application/books/delete-book';
import { ListCustomers } from '@application/customers/list-customers';
import { GetCustomerById } from '@application/customers/get-customer-by-id';
import { InsertCustomer } from '@application/customers/insert-customer';
import { UpdateCustomer } from '@application/customers/update-customer';
import { DeleteCustomer } from '@application/customers/delete-customer';
import { ListBookRentals } from '@application/book-rentals/list-book-rentals';
import { GetBookRentalById } from '@application/book-rentals/get-book-rental-by-id';
import { InsertBookRental } from '@application/book-rentals/insert-book-rental';
import { UpdateBookRental } from '@application/book-rentals/update-book-rental';
import { ReturnBookRental } from '@application/book-rentals/return-book-rental';

export class ApiFastify implements Api {
  private readonly httpServer: FastifyInstance;
  private dbContext?: PrismaDbContext | null;
  private readonly host: string;
  private readonly port: number;

  constructor(
    private logger: Logger,
    host: string = '127.0.0.1',
    port: number = 3000
  ) {
    this.httpServer = fastify();
    this.host = host;
    this.port = port;
  }

  async run(): Promise<void> {
    this.logger.info('ApiFastify - preparing...');
    await this.setupDatabase();
    await this.setupHttpServer();
    this.logger.info('ApiFastify - running...');
  }

  private async setupDatabase() {
    this.dbContext = new PrismaDbContext();
    await this.dbContext.connect();
  }

  private async setupHttpServer() {
    // cors
    await this.httpServer.register(import('@fastify/cors'), {
      origin: '*'
    });

    // swagger
    await this.httpServer.register(import('@fastify/swagger'), {
      openapi: {
        openapi: '3.0.0',
        info: {
          title: 'Bookflix',
          description: 'Bookflix API',
          version: '1.0.0'
        },
        components: {
          // securitySchemes: {
          //   bearerAuth: {
          //     type: 'http',
          //     scheme: 'bearer',
          //     bearerFormat: 'JWT'
          //   }
          // }
        }
      }
    });
    await this.httpServer.register(import('@fastify/swagger-ui'), {
      routePrefix: '/doc',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false
      },
      staticCSP: true,
      transformSpecificationClone: true
    });

    // repositories
    const publisherRepository = PublisherRepositoryPrisma.create(this.dbContext!);
    const bookRepository = BookRepositoryPrisma.create(this.dbContext!);
    const customerRepository = CustomerRepositoryPrisma.create(this.dbContext!);
    const bookRentalRepository = BookRentalRepositoryPrisma.create(this.dbContext!);

    // services
    const insertPublisher = InsertPublisher.create(publisherRepository);
    const updatePublisher = UpdatePublisher.create(publisherRepository);
    const listPublishers = ListPublishers.create(publisherRepository);
    const getPublisherById = GetPublisherById.create(publisherRepository, this.logger);
    const deletePublisher = DeletePublisher.create(publisherRepository);

    const insertBook = InsertBook.create(bookRepository);
    const updateBook = UpdateBook.create(bookRepository);
    const listBooks = ListBooks.create(bookRepository);
    const getBookById = GetBookById.create(bookRepository, this.logger);
    const deleteBook = DeleteBook.create(bookRepository);

    const insertCustomer = InsertCustomer.create(customerRepository);
    const updateCustomer = UpdateCustomer.create(customerRepository);
    const listCustomer = ListCustomers.create(customerRepository);
    const getCustomerById = GetCustomerById.create(customerRepository, this.logger);
    const deleteCustomer = DeleteCustomer.create(customerRepository);

    const insertBookRental = InsertBookRental.create(bookRentalRepository, bookRepository);
    const updateBookRental = UpdateBookRental.create(bookRentalRepository);
    const listBookRentals = ListBookRentals.create(bookRentalRepository);
    const getBookRentalById = GetBookRentalById.create(bookRentalRepository, this.logger);
    const returnBookRental = ReturnBookRental.create(bookRentalRepository, bookRepository);

    // controllers
    this.addController(PublishersController.create(this.logger, insertPublisher, updatePublisher, listPublishers, getPublisherById, deletePublisher));
    this.addController(BooksController.create(this.logger, insertBook, updateBook, listBooks, getBookById, deleteBook));
    this.addController(CustomersController.create(this.logger, insertCustomer, updateCustomer, listCustomer, getCustomerById, deleteCustomer));
    this.addController(BookRentalsController.create(this.logger, insertBookRental, updateBookRental, listBookRentals, getBookRentalById, returnBookRental));

    // running http server
    this.httpServer.listen(
      {
        port: this.port,
        host: this.host
      },
      (error, address) => {
        if (error) {
          console.error(error);
          process.exit(1);
        }
        this.logger.info(`ApiFastify - http server: ${address}`);
      }
    );
  }

  private addController(controller: Controller) {
    controller.getRoutes().forEach((route) => {
      console.log(`--- adding controller: ${route.method} ${route.path}`);
      const schema: any = {
        description: route.description
      };

      // --- RESPONSE ---
      let schemaResponse: any;
      try {
        const properties: any = {};
        // const required: string[] = [];
        route.output.properties?.forEach((prop) => {
          properties[prop!.propertyName] = {
            type: prop!.type == 'datetime' ? 'string' : prop!.type,
            nullable: true
          };
          if (prop!.type == 'datetime') {
            properties[prop!.propertyName]['format'] = 'date-time';
          }
          // const notRequired = prop!.required === false;
          // if (!notRequired) {
          //   required.push(prop!.propertyName);
          // }
          if (prop?.type == 'object' && prop.properties) {
            const className = `${route.name}_${prop!.propertyName}`;
            const schema: any = {
              $id: `${route.path}/${className}`,
              type: 'object',
              properties: {}
            };
            schema.properties[className] = {
              type: 'object',
              properties: {}
            };
            prop!.properties?.forEach((propi) => {
              schema.properties[className].properties[propi!.propertyName] = {
                type: propi!.type == 'datetime' ? 'string' : propi!.type
              };
              if (propi!.type == 'datetime') {
                schema.properties[className].properties[propi!.propertyName]['format'] = 'date-time';
              }
            });
            this.httpServer.addSchema(schema);
            properties[prop!.propertyName]['$ref'] = `${schema.$id}#/properties/${className}`;
          }
          if (prop!.items) {
            const schema: any = {
              $id: `${route.path}/${prop!.items.className}`,
              type: 'object',
              properties: {}
            };
            schema.properties[prop!.items.className] = {
              type: 'object',
              properties: {}
            };
            prop!.items!.properties?.forEach((propi) => {
              schema.properties[prop!.items!.className].properties[propi!.propertyName] = {
                type: propi!.type == 'datetime' ? 'string' : propi!.type
              };
              if (propi!.type == 'datetime') {
                schema.properties[prop!.items!.className].properties[propi!.propertyName]['format'] = 'date-time';
              }
            });
            // this.logger.info('ApiFastify - Schema:', JSON.stringify(schema));
            this.httpServer.addSchema(schema);
            properties[prop!.propertyName].items = {
              $ref: `${schema.$id}#/properties/${prop!.items.className}`
            };
          }
        });
        schemaResponse = {
          default: {
            description: '',
            type: route.output.type
          }
        };
        schemaResponse.default['properties'] = properties;
        // schemaResponse.default['required'] = required;
        this.logger.info('schemaResponse', JSON.stringify(schemaResponse));
      } catch (error) {
        this.logger.error('ApiFastify - addController failed on getting schemaResponse', error);
      }
      schema['response'] = schemaResponse;
      // --- RESPONSE ---

      // --- BODY ---
      let schemaBody: any = null;
      try {
        if (route.input.type == 'object') {
          const properties: any = {};
          route.input.properties?.forEach((prop) => {
            properties[prop!.propertyName] = {
              type: prop!.type
            };
          });
          schemaBody = {
            type: 'object',
            properties: properties
          };
          // this.logger.info('schemaBody', JSON.stringify(schemaBody));
        }
      } catch (error) {
        this.logger.error('ApiFastify - addController failed on getting schemaBody', error);
      }
      if (schemaBody) {
        schema['body'] = schemaBody;
      }
      // --- BODY ---

      // --- QUERY ---
      let schemaQuery: any = null;
      try {
        if (route.query?.properties?.length) {
          schemaQuery = {};
          route.query.properties?.forEach((prop) => {
            schemaQuery[prop!.paramName] = {
              type: prop!.type
            };
            if (prop!.type == 'array') {
              schemaQuery[prop!.paramName] = {
                items: {
                  type: prop!.arrayItemsType
                }
              };
            }
          });
          // this.logger.info('schemaQuery', JSON.stringify(schemaQuery));
        }
      } catch (error) {
        this.logger.error('ApiFastify - addController failed on getting schemaQuery', error);
      }
      if (schemaQuery) {
        schema['querystring'] = schemaQuery;
      }
      // --- QUERY ---

      // this.logger.info('ApiFastify - schema:', JSON.stringify(schema));

      this.httpServer[route.method](
        route.path,
        {
          schema: schema
        },
        async (request) => {
          this.logger.info('ApiFastify - request:', {
            url: request.url,
            method: request.method,
            params: request.params,
            query: request.query,
            body: request.body
          });
          return await route.handler({
            headers: null,
            body: request?.body,
            params: request?.params,
            query: request?.query
          });
        }
      );
    });
  }

  async close() {
    this.logger.info('ApiFastify - closing...');
    await this.httpServer.close();
    await this.dbContext?.disconnect();
  }

  ready(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer.ready().then(() => {
        return resolve();
      });
    });
  }

  getHttpServer(): http.Server {
    return this.httpServer.server;
  }
}
