import {Pipe, PipeTransform} from '@angular/core';
import {formatDistanceStrict} from 'date-fns';

@Pipe({ name: 'maximoConfigracionCategoriaPipe' })
export class MaximoConfigracionCategoriaPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string | number {
    if (value) {
      if (value >= 1000) {
        return 'En adelante';
      } else {
        return value;
      }
    }

    return '';
  }

}
