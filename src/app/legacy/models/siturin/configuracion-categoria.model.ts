import {CategoriaModel} from '@models/siturin';

export interface ConfiguracionCategoriaModel {
  id?: number;
  categoria?: CategoriaModel;
  max?: number;
  min?: number;
  esVisible?: boolean;
}
