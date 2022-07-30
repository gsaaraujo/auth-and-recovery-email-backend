import { BaseError } from '../../common/errors/base-error';

export type HttpResponse = {
  statusCode: number;
  data: any;
};

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  data: data,
});

export const badRequest = (error: BaseError): HttpResponse => ({
  statusCode: 400,
  data: error.message,
});

export const unauthorized = (error: BaseError): HttpResponse => ({
  statusCode: 401,
  data: error.message,
});

export const forbidden = (error: BaseError): HttpResponse => ({
  statusCode: 403,
  data: error.message,
});

export const internalServerError = (error: BaseError): HttpResponse => ({
  statusCode: 500,
  data: error.message,
});
