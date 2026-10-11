import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { NgIf } from '@angular/common';
import { SkeletonComponent } from '../../../../legacy/shared/components/skeleton/skeleton.component';
import { DinardapHttpService } from '@/legacy/services/siturin';

@Component({
    selector: 'app-datos-supercias',
    templateUrl: './datos-supercias.component.html',
    styleUrls: ['./datos-supercias.component.scss'],
    imports: [NgIf, SkeletonComponent]
})
export class DatosSuperciasComponent implements OnInit {
    @Output() numeroExpedienteSuperciasOut: EventEmitter<string> = new EventEmitter();
    @Input() numeroRuc: AbstractControl = new FormControl();
    @Input() numeroRucEstatico: string | null | undefined = null;
    @Input() numeroExpedienteSupercias: string | null | undefined = '';
    @Input() esCatastrado: boolean = false;
    isLoadingSkeleton: string = 'true';

    constructor(private dinardapHttpService: DinardapHttpService) {}

    ngOnInit(): void {
        if (this.numeroExpedienteSupercias === '' || !this.numeroExpedienteSupercias) {
            if (this.numeroRucEstatico) {
                this.isLoadingSkeleton = 'false';
                this.numeroExpedienteSupercias = this.numeroRucEstatico;
                this.numeroExpedienteSuperciasOut.emit(this.numeroRucEstatico);
                // this.obtenerExpediente(this.numeroRucEstatico);
            } else {
                this.obtenerExpediente(this.numeroRuc.value);
            }

            this.numeroRuc.valueChanges.pipe(debounceTime(1500)).subscribe((value) => {
                if (value.length === 13) this.obtenerExpediente(value);
            });
        } else {
            this.isLoadingSkeleton = 'false';
        }
    }

    obtenerExpediente(ruc: string) {
        this.isLoadingSkeleton = 'true';
        this.dinardapHttpService.obtenerExpediente(ruc).subscribe(
            (data) => {
                this.isLoadingSkeleton = 'false';
                this.numeroExpedienteSupercias = data.expediente;
                this.numeroExpedienteSuperciasOut.emit(data.expediente);
            },
            (error) => {
                this.isLoadingSkeleton = 'false';
                this.isLoadingSkeleton = 'error';
            }
        );
    }
}
