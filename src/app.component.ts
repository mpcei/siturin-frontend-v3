import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CoreService } from '@utils/services/core.service';
import { MessageModalComponent } from '@utils/components/message-modal/message-modal.component';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { MessageProcessingComponent } from '@utils/components/message-processing/message-processing.component';
import { AppConfigurator } from '@layout/component/app.configurator';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CatalogueHttpService, CoreSessionStorageService, DpaHttpService } from '@utils/services';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { CoreEnum } from '@utils/enums';
import { from } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, MessageModalComponent, MessageProcessingComponent, AppConfigurator, FormsModule, ConfirmDialog],
    template: ` <!-- show a modal for http response -->
        @if (coreService.processing()) {
            <app-message-processing />
        }

        <!-- show a modal for custom messages -->
        @if (customMessageService.modalVisible()) {
            <app-message-modal />
        }

        <!-- show a toast for custom messages (http response) -->
        <p-toast position="top-center" [life]="customMessageService.modalLife" />

        <!-- show a confirm modal for custom messages (ex. delete) -->
        <p-confirmdialog key="confirmdialog"></p-confirmdialog>

        <!-- init custom styles -->
        <app-configurator />

        <!-- render components -->
        @if (loading) {
            <router-outlet />
        }`
})
export class AppComponent implements OnInit {
    protected readonly coreService = inject(CoreService);
    protected readonly catalogueHttpService = inject(CatalogueHttpService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected loading: boolean = true;
    private readonly dpaHttpService = inject(DpaHttpService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);

    constructor() {}

    async ngOnInit() {
        this.catalogueHttpService
            .findCache()
            .pipe(
                concatMap((response) =>
                    from(this.coreSessionStorageService.setEncryptedValue(CoreEnum.catalogues, response)).pipe(
                        map(() => response) // (Opcional) Pasa la respuesta por si la necesitas luego
                    )
                ),

                switchMap(() => this.dpaHttpService.findCache()),

                concatMap((response) => from(this.coreSessionStorageService.setEncryptedValue(CoreEnum.dpa, response)).pipe(map(() => response)))
            )
            .subscribe();
    }
}
