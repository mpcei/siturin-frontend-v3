import {CatalogoModel, UsuarioInternoModel, ZonalModel} from '@models/siturin';

export interface DpaModel {
  id?: number;
  padreId?: number;
  padre?: DpaModel;
  children?: DpaModel[];
  codigo?: string;
  nombre?: string;
  tipo?: CatalogoModel;
  latitud?: number;
  longitud?: number;
  usuarioInternos?: UsuarioInternoModel[];
  zonal?: ZonalModel;
}
