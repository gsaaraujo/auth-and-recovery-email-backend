export type HttpRequest<T> = {
  data: T;
};

export type HttpResponse = {
  statusCode: number;
  data: any;
};

export const ok = (data: any): HttpResponse => ({
  statusCode: 400,
  data: data,
});

export const badRequest = (errorMessage: string): HttpResponse => ({
  statusCode: 400,
  data: errorMessage,
});

export const unauthorized = (errorMessage: string): HttpResponse => ({
  statusCode: 401,
  data: errorMessage,
});

export const forbidden = (errorMessage: string): HttpResponse => ({
  statusCode: 403,
  data: errorMessage,
});

export const internalServerError = (errorMessage: string): HttpResponse => ({
  statusCode: 500,
  data: errorMessage,
});
