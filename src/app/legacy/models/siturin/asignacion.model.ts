import {DpaModel, TramiteModel, UsuarioInternoModel, ZonalModel} from '@models/siturin';
import {UserModel} from '@models/auth';

export interface AsignacionModel {
  id?: string;
  tramite?: TramiteModel;
  usuarioInterno?: UsuarioInternoModel;
  zonal?: ZonalModel;
  esActual?: boolean;
  fecha?: Date;
  observaciones?: string[];
}
