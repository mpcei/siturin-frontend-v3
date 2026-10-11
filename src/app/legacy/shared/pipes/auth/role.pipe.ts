import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'role' })
export class RolePipe implements PipeTransform {

  transform(value: string): string {
    if (value) value = value.toLowerCase();
    switch (value) {
      case 'admin':
        return 'Administrator';
      case 'teacher':
        return 'Teacher';
      case 'student':
        return 'Student';
    }
    return 'No Role';
  }

}
