import {
  ActividadModel,
  CatastroModel,
  CatalogoModel,
  PersoneriaJuridicaModel,
  EstablecimientoModel,
  ClasificacionModel,
  CategoriaModel,
  HabitacionModel,
  ServicioComplementarioModel,
  InspeccionModel,
  TramiteAlimentoBebidaModel,
  TramiteOperacionIntermediacionModel,
  TramiteAlojamientoModel,
  AsignacionModel,
  DpaModel,
  PagoModel,
  TramiteCtcModel,
  CtcActividadModel, CompaniaTransporteTuristicoModel
} from '@models/siturin';
import {ModalidadTurismoAventuraModel} from '@models/siturin/modalidad-turismo-aventura.model';
import {TramiteTransporteModel} from "@models/siturin";
import {TramiteOtraModel} from "@models/siturin/tramite-otra.model";

export interface TramiteModel {
  id?: number;
  asignacionActual?: AsignacionModel;
  asiganciones?: AsignacionModel[];
  catastro?: CatastroModel;
  actividad?: ActividadModel;
  categoria?: CategoriaModel;
  clasificacion?: ClasificacionModel;
  contratoAreaProtegida?: boolean;
  estado?: CatalogoModel;
  establecimiento?: EstablecimientoModel;
  esAreaProtegida?: boolean;
  habitaciones?: HabitacionModel[];
  inspecciones?: InspeccionModel[];
  inspeccionActual?: InspeccionModel;
  personeriaJuridica?: PersoneriaJuridicaModel;
  tipo?: CatalogoModel;
  tipoLocal?: CatalogoModel;
  usoSuelos?: boolean;
  fecha?: Date;
  fechaLimiteInspeccion?: Date;
  tieneDocumentoActividadTuristica?: boolean;
  tieneNombramientoVigente?: boolean;
  tieneRepresentantesVentas?: boolean;
  tieneGuiasTurismo?: boolean;
  tieneCompaniasTransporteTuristico?: boolean;
  totalHombres?: number;
  totalHombresDiscapacidad?: number;
  totalMujeres?: number;
  totalMujeresDiscapacidad?: number;
  serviciosComplementarios?: ServicioComplementarioModel[];
  companiasTransporteTuristico?: CompaniaTransporteTuristicoModel[];
  guiasTurismo?: ServicioComplementarioModel[];
  guiasTurismoCatastrados?: ServicioComplementarioModel[];
  representantesVentas?: ServicioComplementarioModel[];
  modalidadesTurismoAventura?: ModalidadTurismoAventuraModel[];
  normativaRespuestas?: any[];
  normativaRespuestasModalidadesTurismoAventura?: any[];
  tieneModalidadesTurismoAventura?: boolean;
  tieneModalidadAventuraOtraAgencia?: boolean;
  tieneServiciosComplementarios?: boolean;
  pago?: PagoModel;

  provincia?: DpaModel;
  canton?: DpaModel;
  parroquia?: DpaModel;
  tramiteAlimentoBebida?: TramiteAlimentoBebidaModel;
  tramiteAlojamiento?: TramiteAlojamientoModel;
  tramiteOperacionIntermediacion?: TramiteOperacionIntermediacionModel;
  tramiteCtc?: TramiteCtcModel;
  tramiteTransporte?: TramiteTransporteModel;
  tramiteParque?: any;
  tramiteEvento?: any;
  tramiteOtra?: TramiteOtraModel;
  actividadAlimentosBebidas?: any;
  actividadAlojamiento?: any;
  actividadOperacion?: any;
  actividadTransporte?: any;
  ctcActividades?: CtcActividadModel[];
  transporteTerrestres?: any[];
  ubicacion?: any;
  personaContacto?: any;
  paginaWeb?: string;
}
