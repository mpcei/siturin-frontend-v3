import { Injectable } from '@angular/core';
import { CatalogoSiturinTipoEnum } from '@shared/enums';
import { CatalogoModel } from '@models/siturin';
import { CatalogosSiturinHttpService } from '@services/siturin/catalogos-siturin-http.service';

@Injectable({
    providedIn: 'root'
})
export class CatalogosSiturinService {
    constructor(private catalogosSiturinHttpService: CatalogosSiturinHttpService) {}

    set catalogos(catalogos: CatalogoModel[]) {
        sessionStorage.setItem('catalogos-siturin', JSON.stringify(catalogos));
    }

    get catalogos(): CatalogoModel[] {
        return JSON.parse(String(sessionStorage.getItem('catalogos-siturin'))) as CatalogoModel[];
    }

    obtenerCatalogosPorTipo(tipo: CatalogoSiturinTipoEnum) {
        if (!this.catalogos) {
            this.catalogosSiturinHttpService.obtenerCatalogos().subscribe((catalogos) => {
                this.catalogos = catalogos;
            });
        }
        const catalogos = JSON.parse(String(sessionStorage.getItem('catalogos-siturin')));
        console.log(catalogos);
        if (catalogos) return catalogos.filter((catalogo: CatalogoModel) => catalogo.tipo === tipo);

        return [];
    }

    verificarCatalogos() {
        if (!this.catalogos) {
            this.catalogosSiturinHttpService.obtenerCatalogos().subscribe((catalogos) => {
                this.catalogos = catalogos;
            });
        }
    }

    obtenerCatalogos() {
        this.catalogosSiturinHttpService.obtenerCatalogos().subscribe((catalogos) => {
            this.catalogos = catalogos;
        });
    }
}
