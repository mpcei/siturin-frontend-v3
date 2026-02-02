import { Component } from '@angular/core';
import { Message } from 'primeng/message';
import { Fluid } from 'primeng/fluid';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sri',
    imports: [Message, Fluid, Button],
    templateUrl: './sri.component.html',
    styleUrl: './sri.component.scss'
})
export class SriComponent {
    openSRI() {
        window.open('https://srienlinea.sri.gob.ec/sri-en-linea/SriRucWeb/ConsultaRuc/Consultas/consultaRuc', '_blank');
    }
}
