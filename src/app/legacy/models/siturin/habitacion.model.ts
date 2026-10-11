import {HabitacionTarifaModel, TipoHabitacionModel, TramiteModel} from '@models/siturin';

export interface HabitacionModel {
  id?: number;
  habitacionTarifa?: HabitacionTarifaModel;
  habitacionTarifas?: HabitacionTarifaModel[];
  habitacionTarifaSiguiente?: HabitacionTarifaModel;
  tramite?: TramiteModel;
  tipoHabitacion?: TipoHabitacionModel;
  camas?: number;
  habitaciones?: number;
  plazas?: number;
}
