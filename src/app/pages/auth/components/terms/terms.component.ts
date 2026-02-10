import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { environment } from '@env/environment';
import { CoreService } from '@utils/services/core.service';
import { DatePickerModule } from 'primeng/datepicker';
import { MY_ROUTES } from '@routes';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { AuthService } from '@/pages/auth/auth.service';
import { FontAwesome } from '@/api/font-awesome';

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    standalone: true,
    imports: [PdfViewerModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DatePickerModule]
})
export default class TermsComponent implements OnInit {
    protected readonly FontAwesome = FontAwesome;
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly environment = environment;
    protected readonly coreService = inject(CoreService);

    protected termsAcceptedAt = new FormControl(false, Validators.requiredTrue);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly router = inject(Router);
    private readonly authHttpService = inject(AuthHttpService);
    protected readonly authService = inject(AuthService);

    constructor() {}

    async ngOnInit() {}

    public validateForm() {
        const errors: string[] = [];

        if (this.termsAcceptedAt.invalid) errors.push('Debes aceptar los términos y condiciones para continuar.');

        if (errors.length > 0) {
            this.termsAcceptedAt.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    protected onSubmit() {
        if (this.validateForm()) {
            this.acceptTerms();
        }
    }

    protected acceptTerms() {
        this.authHttpService.acceptTermsConditions(this.termsAcceptedAt.value!).subscribe({
            next: (_) => {
                this.router.navigate([MY_ROUTES.adminPages.user.profile.absolute], { replaceUrl: true });
            }
        });
    }
}
