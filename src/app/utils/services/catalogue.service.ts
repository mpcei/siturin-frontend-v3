import { inject, Injectable } from '@angular/core';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum, CoreEnum } from '@utils/enums';
import { CoreSessionStorageService } from '@utils/services/core-session-storage.service';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {
    private readonly _customMessageService = inject(CustomMessageService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);

    private async getCatalogues(): Promise<CatalogueInterface[]> {
        if (!sessionStorage.getItem(CoreEnum.catalogues)) {
            return [];
        }

        const raw = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.catalogues);

        return Object.values(raw) as CatalogueInterface[];
    }

    async findByType(type: string): Promise<CatalogueInterface[]> {
        const catalogues = await this.getCatalogues();

        return catalogues
            .filter(c => c.type === type)
            .map(c => ({
                id: c.id,
                code: c.code,
                name: c.name,
                enabled: c.enabled,
            }));
    }

    async findByCode(code: string, type: string): Promise<CatalogueInterface | undefined> {
        const catalogues = await this.getCatalogues();

        return catalogues.find(c => c.code === code && c.type === type);
    }
}
