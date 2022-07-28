export type HttpRequest = {
  data: any;
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

export const internalServerError = (errorMessage: string): HttpResponse => ({
  statusCode: 500,
  data: errorMessage,
});
