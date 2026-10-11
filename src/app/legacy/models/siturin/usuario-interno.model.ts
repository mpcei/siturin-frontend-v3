import {ZonalModel} from '@models/siturin/zonal.model';
import {UserModel} from '@models/auth';
import {DpaModel} from '@models/siturin/dpa.model';

export interface UsuarioInternoModel {
  id?: number;
  esDisponible?: boolean;
  zonales?: ZonalModel[];
  dpa?: DpaModel[];
  user?:UserModel;
}
