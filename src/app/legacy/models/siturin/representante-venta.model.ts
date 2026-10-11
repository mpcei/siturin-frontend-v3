import {ClasificacionModel, TramiteModel} from '@models/siturin';

export interface RepresentanteVentaModel {
  id?: number;
  tramite?:TramiteModel;
  clasificacion?: ClasificacionModel;
  capacidad?: number;
  razonSocial?: string;
  ruc?: string;
  tipoContribuyente?: string;
}
