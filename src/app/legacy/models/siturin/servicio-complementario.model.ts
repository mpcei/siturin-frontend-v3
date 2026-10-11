import {ClasificacionModel} from '@models/siturin';

export interface ServicioComplementarioModel {
  id?: number;
  clasificacion?: ClasificacionModel;
  capacidad?: number;
}
