import { Component, inject, Input, OnInit } from '@angular/core';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgIf } from '@angular/common';
import { Tag } from 'primeng/tag';
import { NormativaModel } from '@/legacy/models/siturin';
import { MessageService } from '@/legacy/services/core';

@Component({
    selector: 'app-normativa-interno',
    templateUrl: './normativa-interno.component.html',
    styleUrls: ['./normativa-interno.component.scss'],
    imports: [Bind, Card, TableModule, PrimeTemplate, NgIf, Tag]
})
export class NormativaInternoComponent implements OnInit {
    @Input() normativaRespuestas: NormativaModel[] = [];
    public messageService = inject(MessageService);
    constructor() {}

    ngOnInit(): void {}
}
