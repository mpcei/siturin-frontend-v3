export interface ClasificacionModel {
  id?: number;
  codigo?: string;
  descripcion?: string;
  orden?: number;
  nombre?: string;
  maxHabitaciones?: number;
  minHabitaciones?: number;
  maxPlazas?: number;
  minPlazas?: number;
  esServicioComplementario?: boolean;
  tieneRecategorizacion?: boolean;
}
