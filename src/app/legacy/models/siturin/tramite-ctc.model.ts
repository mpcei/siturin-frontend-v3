import {
  ActividadModel, CatastroModel, CatalogoModel,
  PersoneriaJuridicaModel,
  EstablecimientoModel,
  ClasificacionModel,
  CategoriaModel, HabitacionModel, ServicioComplementarioModel, InspeccionModel
} from '@models/siturin';
import {ModalidadTurismoAventuraModel} from '@models/siturin/modalidad-turismo-aventura.model';

export interface TramiteCtcModel {
  id?: number;
  tieneCertificadoRegistroPropiedad?:boolean;
  tieneInformeTecnico?:boolean;
  tieneEstatuto?:boolean;
  totalCamas?: number;
  totalCapacidades?: number;
  totalHabitaciones?: number;
  totalMesas?: number;
  totalPlazas?: number;
}
