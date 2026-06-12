import { Pipe, PipeTransform } from '@angular/core';

type Severity = 'error' | 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | null | undefined;

@Pipe({
    name: 'credentialStateSeverity',
    standalone: true
})
export class CredentialStateSeverityPipe implements PipeTransform {
    transform(state: string): Severity {
        console.log(state);
         switch (state) {
            case 'expired': {
                return 'error';
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
