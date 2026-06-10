import { Pipe, PipeTransform } from '@angular/core';
import { isWithinInterval, subMonths } from 'date-fns';

@Pipe({
    name: 'expiredCredential',
    standalone: true
})
export class ExpiredCredentialPipe implements PipeTransform {
    transform(date: Date | string | null | undefined): boolean | null {
        if (!date) return null;
        const today = new Date();
        const oneMonthBefore = subMonths(date, 1);

        return isWithinInterval(today, {
            start: oneMonthBefore,
            end: date
        });
    }
}
