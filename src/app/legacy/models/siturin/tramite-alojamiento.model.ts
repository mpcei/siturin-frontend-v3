import {
  ActividadModel, CatastroModel, CatalogoModel,
  PersoneriaJuridicaModel,
  EstablecimientoModel,
  ClasificacionModel,
  CategoriaModel, HabitacionModel, ServicioComplementarioModel, InspeccionModel
} from '@models/siturin';
import {ModalidadTurismoAventuraModel} from '@models/siturin/modalidad-turismo-aventura.model';

export interface TramiteAlojamientoModel {
  id?: number;
  anioRack?:number;
}
