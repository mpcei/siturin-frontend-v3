import { Component, inject, OnInit, signal } from '@angular/core';
import { Message } from 'primeng/message';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { BreadcrumbService } from '@layout/service';
import { TableModule } from 'primeng/table';
import { CredentialInterface, EstablishmentInterface } from '@modules/core/shared/interfaces';
import { EstablishmentHttpService, FormStateService, GuideHttpService, RucHttpService } from '@modules/core/roles/external/services';
import { environment } from '@env/environment';
import { AuthService } from '@/pages/auth/auth.service';
import { Button } from 'primeng/button';
import { FontAwesome } from '@modules/public/icons/font-awesome';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { PaginationInterface } from '@utils/interfaces';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';
import { inactivationButtonAction, registrationButtonAction } from '@utils/components/button-action/consts';
import { Tooltip } from 'primeng/tooltip';
import { CoreService, CustomMessageService } from '@utils/services';
import { Tag } from 'primeng/tag';
import { CatalogueCadastreStatesStateEnum, CatalogueEstablishmentsStateEnum } from '@/pages/core/shared/enums';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueProcessesTypeEnum, CatalogueTypeEnum } from '@utils/enums';
import { CredentialStateSeverityPipe, EstablishmentNumberPipe, ExpiredCredentialPipe } from '@modules/core/shared/pipes';
import { Card } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InactivationComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/inactivation/inactivation.component';
import { Divider } from 'primeng/divider';
import { isAfter, subMonths } from 'date-fns';
import { ReportsHttpService } from '@/pages/core/shared/services';

@Component({
    selector: 'app-guide-establishment-list',
    imports: [Message, ReactiveFormsModule, TableModule, Button, Paginator, ButtonActionComponent, Tooltip, Tag, EstablishmentNumberPipe, Card, DatePipe, Divider, ExpiredCredentialPipe, CredentialStateSeverityPipe],
    templateUrl: './guide-establishment-list.component.html',
    providers: [DialogService],
    styles: [
        `
            .cards-container {
                display: flex;
                gap: 1rem;
                align-items: stretch; /* importante */
            }

            .card {
                flex: 1;
            }
        `
    ]
})
export default class GuideEstablishmentListComponent implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly environment = environment;
    protected establishments = signal<EstablishmentInterface[]>([]);
    protected establishment = signal<EstablishmentInterface>({});
    protected selectedItem!: EstablishmentInterface;
    protected pagination!: PaginationInterface;
    protected readonly FontAwesome = FontAwesome;
    protected buttonActions: MenuItem[] = [];
    protected isButtonActionsEnabled: boolean = false;
    protected readonly coreService = inject(CoreService);
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly router = inject(Router);
    private readonly establishmentHttpService = inject(EstablishmentHttpService);
    private readonly rucHttpService = inject(RucHttpService);
    private readonly authService = inject(AuthService);
    private readonly guideHttpService = inject(GuideHttpService);
    private readonly reportsHttpService = inject(ReportsHttpService);
    private readonly catalogueService = inject(CatalogueService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly formStateService = inject(FormStateService);
    private dialogService = inject(DialogService);
    ref?: DynamicDialogRef | null;

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Establecimientos' }]);
    }

    ngOnInit(): void {
        this.updateSRIEstablishments();
    }

    findEstablishmentsByRuc(page = 1, search = null) {
        this.rucHttpService.findEstablishmentsByRuc(page, search, this.authService.auth.identification!).subscribe({
            next: (response) => {
                const establishment = (response.data as EstablishmentInterface[]).find((item) => item.isCadastre);

                if (establishment && establishment.isCadastre) {
                    this.establishmentHttpService.findCadastreByEstablishment(establishment.id!).subscribe({
                        next: (response) => {
                            this.establishment.set(response);
                            if (this.establishment().currentProcess) {
                                this.customMessageService.showModalWarn({
                                    summary: `Actualmente tiene un trámite de ${this.establishment().currentProcess?.type.name}`,
                                    detail: 'No puede realizar otro trámite'
                                });
                            }
                        }
                    });
                } else {
                    this.establishments.set(response.data);
                    this.pagination = response.pagination!;
                }
            }
        });
    }

    updateSRIEstablishments() {
        this.establishmentHttpService.updateSRIEstablishments(this.authService.auth.identification!).subscribe({
            next: () => {
                this.findEstablishmentsByRuc();
            }
        });
    }

    buildButtonActions(item: EstablishmentInterface) {
        this.buttonActions = [];
        const isClosed = item.state?.code !== CatalogueEstablishmentsStateEnum.open;
        const hasCadastre = item.process?.cadastre;
        const isCadastreActive = item.process?.cadastre?.cadastreState?.state?.code !== CatalogueCadastreStatesStateEnum.inactivate;

        if (!hasCadastre) {
            if (isClosed) {
                this.customMessageService.showModalError({ summary: 'No se puede crear un trámite', detail: 'El establecimiento se encuentra cerrado' });
                return;
            }
        }

        const shouldShowInactivationButton = isClosed && hasCadastre && isCadastreActive;

        if (shouldShowInactivationButton) {
            this.buttonActions.push({
                ...inactivationButtonAction,
                command: () => this.createProcess(item, CatalogueProcessesTypeEnum.registration)
            });
            return;
        }

        if (!hasCadastre) {
            this.buttonActions.push({
                ...registrationButtonAction,
                command: () => this.createRegistrationProcess(item)
            });
            return;
        }
    }

    onSelect({ item, index }: { item: any; index: number }) {
        this.findEstablishment(item.id);
    }

    findEstablishment(id: string) {
        this.establishmentHttpService.findOne(id).subscribe({
            next: (response) => {
                this.selectedItem = response;
                this.buildButtonActions(response);

                if (this.buttonActions.length > 0) this.isButtonActionsEnabled = true;
            }
        });
    }

    validateEstablishment(establishment: EstablishmentInterface) {
        const errors: string[] = [];

        if (!establishment.tradeName) {
            errors.push('No se puede crear un trámite, el establecimiento no cuenta con Nombre Comercial');
        }

        if (establishment.state?.code === CatalogueEstablishmentsStateEnum.closed) {
            errors.push('No se puede crear un trámite, el establecimiento se encuentra cerrado');
        }

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    onPagination(paginatorState: PaginatorState) {
        if (paginatorState?.page || paginatorState.page === 0) this.findEstablishmentsByRuc(paginatorState.page + 1);
    }

    protected async createProcess(establishment: EstablishmentInterface, processType: CatalogueProcessesTypeEnum) {
        if (!this.authService.auth.sex || !this.authService.auth.nationality || !this.authService.auth.birthdate) {
            this.updateGuideInformation(establishment, processType);
            return;
        }

        this.formStateService.updateSection('establishment', { id: establishment.id });
        this.formStateService.updateSection('establishmentTemp', establishment);

        const type = await this.catalogueService.findByCode(processType, CatalogueTypeEnum.processes_type);

        if (!type) {
            this.customMessageService.showModalError({ summary: 'El tipo de trámite no existe', detail: 'Intente de nuevo' });
            return;
        }

        this.formStateService.updateSection('process', { type, startedAt: new Date() });

        await this.router.navigate([MY_ROUTES.corePages.external.guideAccreditation.absolute]);
    }

    protected async createRegistrationProcess(establishment: EstablishmentInterface) {
        this.formStateService.clearState();
        await this.createProcess(establishment, CatalogueProcessesTypeEnum.registration);
    }

    protected async createNewClassificationProcess(establishment: EstablishmentInterface) {
        this.formStateService.clearState();
        await this.createProcess(establishment, CatalogueProcessesTypeEnum.new_classification_update);
    }

    protected async createRenewProcess(establishment: EstablishmentInterface, credential: CredentialInterface) {
        this.formStateService.clearState();
        this.formStateService.updateSection('currentCredential', { ...credential });
        await this.createProcess(establishment, CatalogueProcessesTypeEnum.renewal_classification_update);
    }

    protected async createReAdmissionProcess(establishment: EstablishmentInterface) {
        this.formStateService.clearState();
        await this.createProcess(establishment, CatalogueProcessesTypeEnum.readmission);
    }

    protected updateGuideInformation(establishment: EstablishmentInterface, processType: CatalogueProcessesTypeEnum) {
        this.guideHttpService.updateGuideInformation(this.authService.auth.identification!).subscribe({
            next: async (response: any) => {
                let auth = this.authService.auth;
                auth.birthdate = response.birthdate;
                auth.nationality = response.nationality;
                auth.sex = response.sex;
                this.authService.auth = auth;
                await this.createProcess(establishment, processType);
            }
        });
    }

    protected downloadInactivationCertificate() {
        this.reportsHttpService.downloadInactivationCertificate(this.establishment().process?.cadastre!);
    }

    async openInactivationModal(establishment: EstablishmentInterface) {
        const processType = await this.catalogueService.findByCode(CatalogueProcessesTypeEnum.inactivation, CatalogueTypeEnum.processes_type);

        this.ref = this.dialogService.open(InactivationComponent, {
            header: 'Inactivación',
            width: '50%',
            closable: true,
            data: {
                establishmentId: establishment.id,
                cadastreId: establishment.process?.cadastre?.id,
                processType
            }
        });

        if (this.ref) {
            this.ref.onClose.subscribe((result) => {
                console.log('Modal cerrado');
                console.log(result);
                this.updateSRIEstablishments();
            });
        }
    }

    protected readonly CatalogueEstablishmentsStateEnum = CatalogueEstablishmentsStateEnum;
    protected readonly CatalogueCadastreStatesStateEnum = CatalogueCadastreStatesStateEnum;
    protected readonly CatalogueProcessesTypeEnum = CatalogueProcessesTypeEnum;
}
