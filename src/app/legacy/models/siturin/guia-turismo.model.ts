import {ClasificacionModel, TramiteModel} from '@models/siturin';

export interface GuiaTurismoModel {
  id?: number;
  tramite?:TramiteModel;
  clasificacion?: ClasificacionModel;
  capacidad?: number;
  cedula?: string;
  apellidosNombres?: string;
  licencias?: any[];
}
