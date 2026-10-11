import {CatalogoModel, EstablecimientoModel} from '@models/siturin';

export interface RucDinardapModel {
  id?: string;
  estadoContribuyente?: string;
  tipoContribuyente?: string;
  establecimientos?: any[];
  ruc?: string;
  razonSocial?: string;
  cedulaRepresentanteLegal?: string;
  nombreRepresentanteLegal?: string;
  actividadEconomicaPrincipal?: string;
}
