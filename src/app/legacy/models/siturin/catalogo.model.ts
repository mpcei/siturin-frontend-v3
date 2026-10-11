export interface CatalogoModel {
  id?: string;
  codigo?: string;
  nombre?: string;
  tipo?: string;
  hijos?: CatalogoModel[];
  padre?: CatalogoModel;
}
