import { Component, forwardRef, inject, input } from '@angular/core';
import { AbstractControl, AsyncValidator, ControlValueAccessor, FormsModule, NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { InputOtp, InputOtpChangeEvent } from 'primeng/inputotp';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
    selector: 'app-transactional-code',
    template: ` <p-inputOtp id="transactionalCode" [ngModel]="value" [length]="6" [integerOnly]="true" (onChange)="handleChange($event)" [disabled]="disabled" /> `,
    imports: [FormsModule, InputOtp],
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TransactionalCodeComponent),
            multi: true
        },
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => TransactionalCodeComponent),
            multi: true
        }
    ]
})
export class TransactionalCodeComponent implements ControlValueAccessor, AsyncValidator {
    value: string = '';
    disabled = false;

    requester = input.required<string>();
    private readonly authHttpService = inject(AuthHttpService);

    writeValue(val: string): void {
        this.value = val;
    }

    registerOnChange(fn: (val: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    handleChange(ev: InputOtpChangeEvent) {
        this.value = ev.value;
        this.onChange(this.value);

        if (this.value.length === 6) {
            this.onTouched();
        }
    }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const value = control.value;

        if (!value) {
            return of({ required: true });
        }

        if (value.length < 6) {
            return of({ minlength: { requiredLength: 6, actualLength: value.length } });
        }

        return this.authHttpService.verifyTransactionalCode(value, this.requester()).pipe(
            map((_) => {
                return null;
            }),

            catchError((error) => {
                return of({ invalidTransactionalCode: true });
            })
        );
    }

    private onChange: (val: string) => void = () => {};

    private onTouched: () => void = () => {};
}
