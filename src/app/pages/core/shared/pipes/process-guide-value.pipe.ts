import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'processGuideValue',
    standalone: true
})
export class ProcessGuideValue implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'true': {
                return 'SI';
            }

            case 'false': {
                return 'NO';
            }

            default: {
                return value;
            }
        }
    }
}
