import { Pipe, PipeTransform } from '@angular/core';
import { CatalogueProcessesStateEnum } from '@/pages/core/shared/enums';

type Severity = 'danger' | 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | null | undefined;

@Pipe({
    name: 'processStateSeverity',
    standalone: true
})
export class ProcessStateSeverityPipe implements PipeTransform {
    transform(state: string): Severity {
        switch (state) {
            case CatalogueProcessesStateEnum.reviewed:
            {
                return 'info';
            }
            case CatalogueProcessesStateEnum.approved:
            {
                return 'success';
            }
            case CatalogueProcessesStateEnum.rejected:
            case CatalogueProcessesStateEnum.document_rejected:
            {
                return 'danger';
            }
            case CatalogueProcessesStateEnum.in_process:
            case CatalogueProcessesStateEnum.in_review:
            case CatalogueProcessesStateEnum.in_approval:
            {
                return 'warn';
            }

            default: {
                return null;
            }
        }
    }
}
