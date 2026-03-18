import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'establishmentNumber',
    standalone: true
})
export class EstablishmentNumberPipe implements PipeTransform {
    transform(number: string | undefined): string {
        if (!number) return '0';

        return number.padStart(3, '0');
    }
}
