import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {

  transform(value: string | unknown, ...args: unknown[]): string {
    if (typeof value === 'string') {
      const dateValid = value.includes('T');
      if (!dateValid) {
        value = `${value}T05:00:00.000Z`;
      }
    }

    return <string>value;
  }

}
