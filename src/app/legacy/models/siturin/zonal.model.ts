import {DpaModel} from '@models/siturin/dpa.model';

export interface ZonalModel {
  id?: number;
  codigo?: string;
  nombre?: string;
  director?: string;
  dpa?: DpaModel[];
}
