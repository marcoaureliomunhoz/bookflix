import { Logger } from '@app/lib/logger';

export interface Controller {
  getRoutes(): Route<any, any>[];
}

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete'
}

export interface HandlerProps<TInput, TParams = any, TQuery = any> {
  headers: any;
  body: TInput;
  params: TParams;
  query: TQuery;
}

export interface InputOutputDescription {
  description?: string | null;
  type: string;
  className?: string | null;
  properties?: Array<InputOutputPropertyDescription | null>;
}

export interface InputParamsDescription {
  properties?: Array<InputParamDescription | null>;
}

export interface InputParamDescription {
  paramName: string;
  type: string;
  required?: boolean | null;
}

export interface InputQueryDescription {
  properties?: Array<InputQueryItemDescription | null>;
}

export interface InputQueryItemDescription {
  paramName: string;
  type: string;
  required?: boolean | null;
  arrayItemsType?: string | number;
}

export interface InputOutputPropertyDescription {
  propertyName: string;
  type: string;
  properties?: Array<InputOutputPropertyDescription | null>;
  items?: InputOutputPropertyItemsDescription | null;
  required?: boolean | null;
}

export interface InputOutputPropertyItemsDescription {
  className: string;
  properties?: Array<InputOutputPropertyDescription | null>;
}

export interface Route<TBody, TOutput, TParams = any, TQuery = any> {
  name: string;
  method: HttpMethod;
  path: string;
  description: string;
  handler: (props: HandlerProps<TBody, TParams, TQuery>) => Promise<TOutput>;
  input: InputOutputDescription;
  output: InputOutputDescription;
  query?: InputQueryDescription;
}

export class BaseController implements Controller {
  protected routes: Route<any, any, any>[] = [];

  constructor(
    private name: string,
    private readonly logger: Logger
  ) {}

  getRoutes(): Route<any, any, any>[] {
    return this.routes;
  }

  protected addRoute<TInput, TOutput>(
    name: string,
    method: HttpMethod,
    path: string,
    handler: (props: HandlerProps<TInput>) => Promise<TOutput>,
    description: string,
    input: InputOutputDescription,
    output: InputOutputDescription,
    query?: InputQueryDescription
  ) {
    const fullPath = `/${this.name}${path}`;

    this.logger.info(`BaseController - addRoute - fullPath: ${fullPath}`);

    if (fullPath.endsWith('/')) {
      this.routes.push({
        name: name,
        method: method,
        path: fullPath.substring(0, fullPath.lastIndexOf('/')),
        handler: handler,
        description: description,
        input: input,
        output: output,
        query: query
      });
      return;
    }
    this.routes.push({
      name: name,
      method: method,
      path: fullPath,
      handler: handler,
      description: description,
      input: input,
      output: output,
      query: query
    });
  }

  protected getParsedQuery<TQuery>(routeName: string, query: any): TQuery {
    const parsedQuery = { ...query };
    const route = this.routes?.find((r) => r.name == routeName);
    const queryProperties = route?.query?.properties?.filter((p) => !!p) || [];
    if (queryProperties.length === 0) return parsedQuery;
    queryProperties.forEach((p) => {
      if (p.type == 'array') {
        const queryValue = `${parsedQuery[p.paramName] || ''}`.trim();
        parsedQuery[p.paramName] = queryValue
          ? queryValue.split(',').map((value) => {
              if (p.arrayItemsType == 'number') return Number(value);
              return value;
            })
          : [];
      }
    });
    return parsedQuery;
  }
}
