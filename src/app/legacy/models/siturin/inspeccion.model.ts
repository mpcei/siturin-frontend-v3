import {CatalogoModel, TramiteModel, UsuarioInternoModel} from '@models/siturin';

export interface InspeccionModel {
  id?: string;
  tramite?: TramiteModel;
  usuarioInterno?: UsuarioInternoModel;
  estadoFecha?: CatalogoModel;
  esActual?: boolean;
  esAtendida?: boolean;
  fechaCreacion?: Date;
  fechaInspeccion?: Date | string;
  fechaSolicitud?: Date | string;
  fechaLimite?: Date | string;
  observaciones?: string[];
  confirmada?: boolean;
}
