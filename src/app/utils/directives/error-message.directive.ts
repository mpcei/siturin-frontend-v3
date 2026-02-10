import { Directive, ElementRef, inject, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { passwordPolicesValidator } from '@utils/form-validators/custom-validator';

@Directive({
    selector: '[appErrorMessage]',
    standalone: true
})
export class ErrorMessageDirective implements OnChanges {
    private _elementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    private _renderer = inject(Renderer2);
    private _errors: ValidationErrors | null | undefined = null;
    private _dirty: boolean | null | undefined = false;
    private _touched: boolean | null | undefined = false;
    private readonly _nativeElement: HTMLDivElement;
    private readonly _errorMessages: Record<string, string | ((errors: any) => string)> = {
        required: this.fieldRequired,
        requiredTrue: this.fieldRequired,
        email: this.fieldEmail,
        minlength: this.fieldMinLength,
        maxlength: this.fieldMaxLength,
        min: this.fieldMin,
        max: this.fieldMax,
        pattern: this.fieldPattern,
        noPasswordMatch: this.fieldNoPasswordMatch,
        invalidEmail: this.fieldInvalidEmail,
        invalidEmailDomain: this.fieldInvalidEmailDomain,
        registeredIdentification: this.fieldRegisteredIdentification,
        userExist: this.fieldUserExist,
        unregisteredUser: this.fieldUnregisteredUser,
        unavailableUser: this.fieldUnavailableUser,
        unavailableEmail: this.fieldUnavailableEmail,
        pendingPaymentRuc: this.fieldRucPendingPayment,
        phoneNotAvailable: this.fieldPhoneNotAvailable,
        dateInvalid: this.fieldDateValid,
        dateMax: this.fieldDateMax,
        dateMin: this.fieldDateMin,
        agreementExists: this.fieldAgreementExists,
        invalidPasswordPolicesUpper: this.fieldPasswordPolicesUpper,
        invalidPasswordPolicesLower: this.fieldPasswordPolicesLower,
        invalidPasswordPolicesNumber: this.fieldPasswordPolicesNumber,
        invalidPasswordPolicesSpecialCharacter: this.fieldPasswordPolicesSpecialCharacter,
        invalidTransactionalCode: this.fieldInvalidTransactionalCode
    };

    constructor() {
        this._nativeElement = this._elementRef.nativeElement;
    }

    ngOnChanges(): void {
        this.setErrorMessage();
    }

    @Input() set touched(value: boolean | null | undefined) {
        this._touched = value;
    }

    @Input() set dirty(value: boolean | null | undefined) {
        this._dirty = value;
    }

    @Input() set errors(value: ValidationErrors | null | undefined) {
        this._errors = value;
    }

    setErrorMessage() {
        let text = '';

        let texts: string[] = [];

        if ((this._touched || this._dirty) && this._errors) {
            for (const key in this._errors) {
                const handler = this._errorMessages[key];
                if (!handler) continue;

                const msg = typeof handler === 'function' ? handler(this._errors) : handler;

                if (msg) texts.push(msg);
            }

            text = texts.join('\n');
            this._renderer.addClass(this._nativeElement, 'form-error');
        }

        this._renderer.setProperty(this._nativeElement, 'innerText', text);
    }

    private get fieldRequired(): string {
        return 'El campo es obligatorio.';
    }

    private get fieldEmail(): string {
        return 'Correo electrónico no es válido.';
    }

    private fieldMinLength(errors: ValidationErrors) {
        return `Debe contener como mínimo ${errors['minlength']['requiredLength']} caracteres.`;
    }

    private fieldMaxLength(errors: ValidationErrors): string {
        return `Debe contener como máximo de caracteres ${errors['maxlength']['requiredLength']}.`;
    }

    private fieldMin(errors: ValidationErrors) {
        return `Número mínimo permitido es ${errors['min']['min']}.`;
    }

    private fieldMax(errors: ValidationErrors): string {
        return `Número maximo permitido es ${errors['max']['max']}.`;
    }

    private get fieldPattern() {
        return `No cumple con el formato.`;
    }

    private get fieldNoPasswordMatch(): string {
        return 'Las contraseñas no coinciden.';
    }

    private get fieldDateValid(): string {
        return 'No es una fecha válida.';
    }

    private fieldDateMax(errors: ValidationErrors): string {
        return `La fecha ${errors['dateMax']['actualDate']} no puede ser mayor a ${errors['dateMax']['requiredDate']}.`;
    }

    private fieldDateMin(errors: ValidationErrors): string {
        return `La fecha ${errors['dateMin']['actualDate']} no puede ser menor a ${errors['dateMin']['requiredDate']}.`;
    }

    private get fieldIdentification() {
        return `No cumple con el formato de una cédula Ecuatoriana.`;
    }

    private get fieldUserNotAvailable(): string {
        return 'Este usuario ya se encuentra registrado.';
    }

    private get fieldUserAvailable(): string {
        return 'Usuario está disponible.';
    }

    private get fieldInvalidEmail(): string {
        return 'Correo electrónico no es válido.';
    }

    private fieldInvalidEmailDomain(errors: ValidationErrors): string {
        return `Correo electrónico no puede pertencer a ${errors['invalidEmailDomain']['disallowedDomain']}.`;
    }

    private get fieldPhoneNotAvailable(): string {
        return 'Este teléfono no está disponible.';
    }

    private get fieldAgreementExists(): string {
        return 'El número interno de convenio ya se encuentra registrado.';
    }

    private get fieldRegisteredIdentification(): string {
        return 'El RUC ya se encuentra registrado.';
    }

    private get fieldRucPendingPayment(): string {
        return 'El RUC ingresado mantiene pendiente el pago de la Contribución Uno por Mil sobre Activos Fijos, cobrados por esta Cartera de Estado, dentro del periodo de vigencia de la Ley de Turismo de Registro Oficial Suplemento No. 733 de 27 de Diciembre 2002, por favor sírvase asistir a la oficina zonal en la que se encuentra registrado su establecimiento para el trámite de revisión y declaración respectiva.';
    }

    private get fieldUnavailableUser(): string {
        return 'El usuario no se encuentra disponible.';
    }

    private get fieldUnavailableEmail(): string {
        return 'El correo ya se encuentra en uso, por favor intente con otro.';
    }

    private get fieldUserExist(): string {
        return 'El usuario ya se encuentra registrado, por favor intente con otro.';
    }

    private get fieldUnregisteredUser(): string {
        return 'El usuario no se encuentra registrado, por favor registre una cuenta.';
    }

    private fieldPasswordPolicesUpper(errors: ValidationErrors): string {
        return `La contraseña debe tener al menos ${errors['invalidPasswordPolicesUpper']['length']} Mayúscula`;
    }

    private fieldPasswordPolicesLower(errors: ValidationErrors): string {
        return `La contraseña debe tener al menos ${errors['invalidPasswordPolicesLower']['length']} minúsculas`;
    }

    private fieldPasswordPolicesNumber(errors: ValidationErrors): string {
        return `La contraseña debe tener al menos ${errors['invalidPasswordPolicesNumber']['length']} números`;
    }

    private fieldPasswordPolicesSpecialCharacter(errors: ValidationErrors): string {
        return `La contraseña debe tener al menos  ${errors['invalidPasswordPolicesSpecialCharacter']['length']} caracter especial ${errors['invalidPasswordPolicesSpecialCharacter']['allowed']}`;
    }

    private get fieldInvalidTransactionalCode(): string {
        return 'El código de seguridad no es válido';
    }
}
