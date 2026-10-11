import {CatalogoModel, EstablecimientoModel} from '@models/siturin';
import {UserModel} from "@models/auth";

export interface PagoModel {
  id?: number;
  tieneDeuda?: boolean;
  ruc?: string;
}
