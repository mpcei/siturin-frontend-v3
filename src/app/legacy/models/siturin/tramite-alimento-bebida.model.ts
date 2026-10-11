import {
  ActividadModel, CatastroModel, CatalogoModel,
  PersoneriaJuridicaModel,
  EstablecimientoModel,
  ClasificacionModel,
  CategoriaModel, HabitacionModel, ServicioComplementarioModel, InspeccionModel
} from '@models/siturin';
import {ModalidadTurismoAventuraModel} from '@models/siturin/modalidad-turismo-aventura.model';

export interface TramiteAlimentoBebidaModel {
  id?: number;
  tieneCertificadoConcesionFranquicia?:boolean;
  tipoEstablecimiento?: CatalogoModel;
  nombreEstablecimiento?: string;
  tiposCocina?: CatalogoModel[];
  tiposServicio?: CatalogoModel[];
  totalCapacidades?: number;
  totalMesas?: number;
}
