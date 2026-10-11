import {Component, Input, OnInit} from '@angular/core';
import { NgIf } from '@angular/common';
import { Bind } from 'primeng/bind';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';

@Component({
    selector: 'app-skeleton',
    templateUrl: './skeleton.component.html',
    styleUrls: ['./skeleton.component.scss'],
    imports: [NgIf, Bind, Skeleton, TableModule, PrimeTemplate]
})
export class SkeletonComponent implements OnInit {
  @Input() type = 'rectangle';
  products = ['test1', 'test2', 'test3', 'test4', 'test5'];

  constructor() {
  }

  ngOnInit(): void {
  }
}
