import { Routes } from '@angular/router';
import { ValidadorDocumentoComponent } from '../siturin/validador-documento/validador-documento.component';
import { DocumentValidator } from '../core/document-validator/document-validator';

export default [
    {
        path: '',
        title: 'SITURIN V3',
        loadComponent:()=> DocumentValidator
    }
] as Routes;
