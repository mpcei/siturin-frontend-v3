import {
  CatalogoModel,
  DpaModel,
  HabitacionModel,
  NormativaModel,
  RucModel,
  TramiteModel
} from '@models/siturin';
import {UserModel} from "@models/auth";

export interface EstablecimientoModel {
  id?: number;
  estado?: CatalogoModel;
  ruc?: RucModel;
  tramiteActual?: TramiteModel;
  tramites?: TramiteModel[];
  tramiteOpciones?: CatalogoModel[];
  esMatriz?: boolean;
  nombreComercial?: string;
  numero?: string;
  personaContacto?: PersonaContacto;
  ubicacion?: Ubicacion;
  paginaWeb?: string;
  dpa?: DpaModel;
  provincia?: DpaModel;
  canton?: DpaModel;
  parroquia?: DpaModel;
  habitaciones?: HabitacionModel[];
}

interface Ubicacion {
  callePrincipal?: string;
  calleInterseccion?: string;
  calleNumeracion?: string;
  calleReferencia?: string;
  latitud?: number;
  longitud?: number;
  ubicacionGeografica?: string;
}

interface PersonaContacto {
  identificacion?: string;
  nombres?: string;
  telefonoPrincipal?: string;
  telefonoSecundario?: string;
  correo?: string;
}

export interface CreateEstablcimientoDto extends Omit<EstablecimientoModel, 'id'> {
}

export interface UpdateEstablcimientoDto extends Partial<Omit<EstablecimientoModel, 'id'>> {
}

export interface SelectEstablcimientoDto extends Partial<EstablecimientoModel> {
}
