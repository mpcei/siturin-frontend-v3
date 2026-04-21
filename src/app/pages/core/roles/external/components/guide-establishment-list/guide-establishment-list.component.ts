import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Message } from 'primeng/message';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { BreadcrumbService } from '@layout/service';
import { TableModule } from 'primeng/table';
import { EstablishmentInterface } from '@modules/core/shared/interfaces';
import { EstablishmentHttpService, FormStateService, RucHttpService } from '@modules/core/roles/external/services';
import { environment } from '@env/environment';
import { AuthService } from '@/pages/auth/auth.service';
import { Button } from 'primeng/button';
import { FontAwesome } from '@modules/public/icons/font-awesome';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { PaginationInterface } from '@utils/interfaces';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';
import { inactivationButtonAction, registrationButtonAction } from '@utils/components/button-action/consts';
import { Tooltip } from 'primeng/tooltip';
import { CoreService, CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { Tag } from 'primeng/tag';
import { CatalogueCadastreStatesStateEnum, CatalogueEstablishmentsStateEnum } from '@/pages/core/shared/enums';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueActivitiesGeographicAreaEnum, CatalogueProcessesTypeEnum, CatalogueTypeEnum } from '@utils/enums';
import { EstablishmentNumberPipe } from '@modules/core/shared/pipes';

@Component({
    selector: 'app-guide-establishment-list',
    imports: [Message, ReactiveFormsModule, TableModule, Button, Paginator, ButtonActionComponent, Tooltip, Tag, EstablishmentNumberPipe],
    templateUrl: './guide-establishment-list.component.html'
})
export default class GuideEstablishmentListComponent implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly environment = environment;
    protected establishments = signal<EstablishmentInterface[]>([]);
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
    private readonly catalogueService = inject(CatalogueService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly formStateService = inject(FormStateService);
    private readonly destroyRef = inject(DestroyRef);

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Establecimientos' }]);
    }

    ngOnInit(): void {
        this.updateSRIEstablishments();
    }

    findEstablishmentsByRuc(page = 1, search = null) {
        this.rucHttpService.findEstablishmentsByRuc(page, search, this.authService.auth.identification!).subscribe({
            next: (response) => {
                this.establishments.set(response.data);
                this.pagination = response.pagination!;
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
        const hasNoTradeName = !item.tradeName;
        const isClosed = item.state?.code !== CatalogueEstablishmentsStateEnum.open;
        const hasCadastre = item.process?.cadastre;
        const isCadastreActive = item.process?.cadastre?.cadastreState?.state?.code !== CatalogueCadastreStatesStateEnum.inactivated;

        if (!hasCadastre) {
            if (hasNoTradeName) {
                this.customMessageService.showModalError({ summary: 'No se puede crear un trámite', detail: 'El establecimiento no cuenta con Nombre Comercial' });
                return;
            }

            if (isClosed) {
                this.customMessageService.showModalError({ summary: 'No se puede crear un trámite', detail: 'El establecimiento se encuentra cerrado' });
                return;
            }
        }

        const shouldShowInactivationButton = (hasNoTradeName || isClosed) && hasCadastre && isCadastreActive;

        if (shouldShowInactivationButton) {
            this.buttonActions.push({
                ...inactivationButtonAction,
                command: () => this.createProcess(item)
            });
            return;
        }

        if (!hasCadastre) {
            this.buttonActions.push({
                ...registrationButtonAction,
                command: () => this.createProcess(item)
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

    private async createProcess(establishment: EstablishmentInterface) {
        this.formStateService.clearState();

        this.formStateService.updateSection('establishment', { id: establishment.id });
        this.formStateService.updateSection('establishmentTemp', establishment);

        const type = await this.catalogueService.findByCode(CatalogueProcessesTypeEnum.registration, CatalogueTypeEnum.processes_type);

        if (!type) {
            this.customMessageService.showModalError({ summary: 'El tipo de trámite no existe', detail: 'Intente de nuevo' });
            return;
        }

        this.formStateService.updateSection('process', { type });

        await this.router.navigate([MY_ROUTES.corePages.external.guideAccreditation.absolute]);
    }

    private delete(id: string) {}

    protected readonly CatalogueEstablishmentsStateEnum = CatalogueEstablishmentsStateEnum;
}
