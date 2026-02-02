import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NgClass } from '@angular/common';
import { FontAwesome } from '@/api/font-awesome';

@Component({
    selector: 'app-admin-dashboard',
    imports: [ReactiveFormsModule, TableModule, NgClass],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss'
})
export default class AdminDashboardComponent {
    protected readonly FontAwesome = FontAwesome;
    protected readonly NgClass = NgClass;
}
