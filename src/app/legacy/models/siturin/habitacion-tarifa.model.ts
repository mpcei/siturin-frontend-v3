import {HabitacionModel} from '@models/siturin';

export interface HabitacionTarifaModel {
  id?: number;
  anio?: number;
  fechaDeclaracion?: Date;
  habitacion?: HabitacionModel;
  habitacionTemporadaAlta?: number;
  habitacionTemporadaBaja?: number;
  personaTemporadaAlta?: number;
  personaTemporadaBaja?: number;
}
