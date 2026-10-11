import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'activeUser' })
export class ActivePipe implements PipeTransform {

  transform(value: boolean): string {
    if (value) return 'ACTIVE';

    return 'INACTIVE';
  }

}
