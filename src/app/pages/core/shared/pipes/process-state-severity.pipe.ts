import { Pipe, PipeTransform } from '@angular/core';

type Severity = 'danger' | 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | null | undefined;

@Pipe({
    name: 'processStateSeverity',
    standalone: true
})
export class ProcessStateSeverityPipe implements PipeTransform {
    transform(state: string): Severity {
        switch (state) {
            case 'expired': {
                return 'danger';
            }
            case 'current': {
                return 'success';
            }
            case 'in_progress': {
                return 'warn';
            }

            default: {
                return null;
            }
        }
    }
}
