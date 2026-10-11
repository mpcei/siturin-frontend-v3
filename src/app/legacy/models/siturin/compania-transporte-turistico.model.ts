import {CatalogoModel,  RucModel, TramiteModel} from '@models/siturin';

export interface CompaniaTransporteTuristicoModel {
  id?: number;
  tramite?: TramiteModel;
  ruc?: RucModel;
  numeroRuc?: string;
  numeroAutorizacion?: string;
  razonSocial?: string;
  cedulaRepresentanteLegal?: string;
  nombreRepresentanteLegal?: string;
  tipoContribuyente?: CatalogoModel;
  tipo?: CatalogoModel;
}
