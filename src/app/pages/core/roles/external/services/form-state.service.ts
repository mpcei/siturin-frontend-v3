import { Injectable, signal, effect, computed } from '@angular/core';
import { EstablishmentAddressInterface, EstablishmentInterface, ProcessInterface, RucInterface } from '@/pages/core/shared/interfaces';
import { AbstractControl } from '@angular/forms';

interface Credential {
    classificationCode: string;
    startedAt: Date;
    endedAt: Date;
    protectedAreas: any[];
    modalities: any[];
    origin: string;
    code: string;
    type: string;
}

interface CatastroSiete {
    type?: string;
    credentials?: Credential[];
}

export interface AppFormState {
    establishment: EstablishmentInterface | null;
    establishmentTemp: EstablishmentInterface | null;
    process: ProcessInterface | null;
    processTemp: ProcessInterface | null;
    processGuides: any[];
    ruc: RucInterface | null;
    civilRegistry: ProcessInterface | null;
    user: any | null;
    userTemp: any | null;
    establishmentAddress: EstablishmentAddressInterface | null;
    adventureModality: any | null;
    language: any | null;
    protectedArea: any | null;
    degrees: any[];
    degree: any | null;
    files: any[];
    catastroSiete: CatastroSiete | null;
    guideOrigin: any | null;
}

const INITIAL_STATE: AppFormState = {
    ruc: null,
    civilRegistry: null,
    establishment: null,
    establishmentTemp: null,
    process: null,
    processTemp: null,
    processGuides: [],
    user: null,
    userTemp: null,
    establishmentAddress: null,
    adventureModality: null,
    language: null,
    protectedArea: null,
    degrees: [],
    degree: null,
    files: [],
    catastroSiete: null,
    guideOrigin: null
};

const FORM_STATE_KEY = 'formState';
const FORM_ERRORS_KEY = 'formErrors';

@Injectable({ providedIn: 'root' })
export class FormStateService {
    readonly formState = signal<AppFormState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly establishment = computed(() => this.formState().establishment);
    readonly establishmentTemp = computed(() => this.formState().establishmentTemp);
    readonly process = computed(() => this.formState().process);
    readonly processTemp = computed(() => this.formState().processTemp);
    readonly processGuides = computed(() => this.formState().processGuides);
    readonly user = computed(() => this.formState().user);
    readonly userTemp = computed(() => this.formState().userTemp);
    readonly establishmentAddress = computed(() => this.formState().establishmentAddress);
    readonly adventureModality = computed(() => this.formState().adventureModality);
    readonly language = computed(() => this.formState().language);
    readonly protectedArea = computed(() => this.formState().protectedArea);
    readonly degrees = computed(() => this.formState().degrees);
    readonly degree = computed(() => this.formState().degree);
    readonly files = computed(() => this.formState().files);
    readonly catastroSiete = computed(() => this.formState().catastroSiete);
    readonly guideOrigin = computed(() => this.formState().guideOrigin);

    constructor() {
        effect(() => {
            sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(this.formState()));
            sessionStorage.setItem(FORM_ERRORS_KEY, JSON.stringify(this.formErrors()));
        });
    }

    updateSection<K extends keyof AppFormState>(section: K, data: Partial<AppFormState[K]>) {
        this.formState.update((state) => ({
            ...state,
            [section]: {
                ...state[section], // lo anterior
                ...data // lo nuevo
            }
        }));
    }

    clearState() {
        this.formState.set(INITIAL_STATE);
        sessionStorage.removeItem(FORM_STATE_KEY);
    }

    private loadFromStorage(): AppFormState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }

    setFormErrors(componentKey: string, errors: string[]): void {
        this.formErrors.update((current) => ({
            ...current,
            [componentKey]: errors
        }));
    }

    readonly allErrors = computed(() => Object.values(this.formErrors()).flat());

    readonly hasErrors = computed(() => this.allErrors().length > 0);

    private readonly forms = new Map<string, AbstractControl>();

    registerForm(key: string, form: AbstractControl): void {
        this.forms.set(key, form);
    }

    unregisterForm(key: string): void {
        this.forms.delete(key);
    }

    private markAllTouched(key?: string): void {
        if (key) {
            this.forms.get(key)?.markAllAsTouched();
        } else {
            console.log(this.forms);
            this.forms.forEach((form) => form.markAllAsTouched());
        }
    }

    validateAll(): boolean {
        this.markAllTouched();
        return !this.hasErrors();
    }
}
