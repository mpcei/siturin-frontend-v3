import {CatalogoModel} from '@models/siturin/catalogo.model';
import {TramiteModel} from '@models/siturin/tramite.model';

export interface CatastroModel {
  id?: number;
  estado?: CatalogoModel;
  tramite?: TramiteModel;
  numeroRegistro?: string;
  fechaRegistro?: Date;
  sistemaOrigen?: string;
  observaciones?: string[];
}
