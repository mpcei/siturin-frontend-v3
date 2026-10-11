export interface NormativaModel {
  id?: number;
  children?: NormativaModel[];
  padre?: NormativaModel;
  esObligatorio?: boolean;
  esPregunta?: boolean;
  esRequisitoAventura?: boolean;
  esVisible?: boolean;
  esAreaProtegida?: boolean;
  maximoPreguntas?: number;
  minimoPreguntas?: number;
  orden?: number;
  nombre?: string;
  puntaje?: number;
}
