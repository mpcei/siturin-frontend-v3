import {PaginatorModel} from '@models/core';

export interface ServerResponse {
  data: any;
  msg?: Msg;
  token?: string;
  version?: string;
  pagination?: PaginatorModel;
}

export interface ServerResponsePaginator extends ServerResponse {
  meta: PaginatorModel;
  links?: Links;
}

export interface Msg {
  summary: string;
  detail?: string;
}

interface Links {
  first: string;
  last: string;
  prev: string;
  next: string;
}
