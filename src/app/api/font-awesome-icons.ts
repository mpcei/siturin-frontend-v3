import { Component, OnInit } from '@angular/core';
import { FontAwesome } from '@/api/font-awesome';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Divider } from 'primeng/divider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-font-awesome-icons',
    imports: [Tooltip, InputText, TableModule, Divider, ReactiveFormsModule, Button],
    template: `
        <div class="card p-4">
            <h2 class="mb-4">Galería de Iconos (Sin DataView)</h2>

            <div class="flex flex-wrap gap-3 justify-content-center">
                <input pInputText type="text" [formControl]="search" class="w-full" />

                <p-divider />

                @for (icon of iconsList; track icon.name) {
                    <div style="width: 150px; height: 120px;" (click)="copyCode(icon.name)" pTooltip="Copiar código"
                         tooltipPosition="top">
                        <p-button [icon]="icon.css" size="large" />

                        <p-divider />

                        <span
                            class="text-xs text-500 font-bold text-center white-space-nowrap overflow-hidden text-overflow-ellipsis w-full">
                            {{ icon.name }}
                        </span>
                    </div>
                }
            </div>
        </div>
    `
})
export default class FontAwesomeIcons implements OnInit {
    // Aquí guardaremos la lista para el HTML
    allIconsList: any[] = [];
    iconsList: any[] = [];
    search = new FormControl('');

    ngOnInit() {
        // Object.entries convierte la clase en un array de pares [clave, valor]
        // Ejemplo: ['ICON_0_SOLID', 'fas fa-0']

        this.iconsList = Object.entries(FontAwesome).map(([key, value]) => {
            return {
                name: key, // Ej: ICON_0_SOLID
                css: value // Ej: fas fa-0
            };
        });

        this.allIconsList = Object.entries(FontAwesome).map(([key, value]) => {
            return {
                name: key, // Ej: ICON_0_SOLID
                css: value // Ej: fas fa-0
            };
        });

        this.search.valueChanges.subscribe((value) => {
            if (value) this.iconsList = this.allIconsList.filter((icon) => icon.name.toLowerCase().includes(value.toLowerCase()) || value.toLowerCase().includes(icon.css.toLowerCase()));
            else this.iconsList = this.allIconsList;
        });
    }

    // Utilidad para copiar al portapapeles al hacer click
    copyCode(val: string) {
        navigator.clipboard.writeText(`FontAwesome.${val}`);
    }
}
