import {CatalogoModel, EstablecimientoModel} from '@models/siturin';
import {UserModel} from "@models/auth";

export interface RucModel {
  id?: string;
  user?: UserModel;
  estado?: CatalogoModel;
  estadoContribuyente?: CatalogoModel;
  tipoContribuyente?: CatalogoModel;
  establecimientos?: EstablecimientoModel[];
  numero?: string;
  numeroExpedienteSupercias?: string;
  razonSocial?: string;
  representanteLegalIdentificacion?: string;
  representanteLegalNombres?: string;
}
