import { Component } from '@angular/core';
import { environment } from '@env/environment';
import { format } from 'date-fns';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: ` <div class="layout-footer">&copy; {{ environment.APP_SHORT_NAME }} {{ currentYear }}</div>`
})
export class AppFooter {
    protected readonly environment = environment;
    protected currentYear: string;

    constructor() {
        this.currentYear = format(new Date(), 'yyyy');
    }
}
