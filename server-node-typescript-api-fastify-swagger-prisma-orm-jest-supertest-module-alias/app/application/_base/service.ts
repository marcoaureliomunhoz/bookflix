export interface Service<ServiceInput, Output> {
  handler(input: ServiceInput): Promise<Output>;
}

export interface ServiceInput<Params, Body, Query = null> {
  params?: Params | null;
  body?: Body | null;
  query?: Query | null;
}
