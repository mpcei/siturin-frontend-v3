import {CatalogoModel} from "@models/siturin/catalogo.model";
import {TramiteModel} from "@models/siturin/tramite.model";

export interface CtcActividadModel {
  id?: number;
  actividad?: CatalogoModel;
  tramite?: TramiteModel;
}
