import {CatalogoModel, TramiteModel} from '@models/siturin';

export interface TipoHabitacionModel {
  id?: number;
  tramite?: TramiteModel;
  zonaGeografica?: CatalogoModel;
  codigo?: string;
  esCama?: boolean;
  esHabitacion?: boolean;
  esPlaza?: boolean;
  esVisible?: boolean;
  nombre?: boolean;
}
