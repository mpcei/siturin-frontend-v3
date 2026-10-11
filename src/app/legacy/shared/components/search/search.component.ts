import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MenuItem, PrimeTemplate } from "primeng/api";
import { UntypedFormControl, ReactiveFormsModule } from "@angular/forms";
import {CoreService, MessageService} from "@services/core";
import {ColumnModel, PaginatorModel} from "@models/core";
import {debounceTime} from "rxjs";
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { Toolbar } from 'primeng/toolbar';
import { Paginator } from 'primeng/paginator';
import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    imports: [Bind, Card, Toolbar, Paginator, NgClass, ReactiveFormsModule, InputText, TableModule, PrimeTemplate, NgFor, ButtonDirective, Ripple, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, Tooltip, AsyncPipe, DatePipe]
})
export class SearchComponent implements OnInit {
  @Input() columns: ColumnModel[] = [];
  @Input() records: any[] = [];
  @Input() paginatorIn = this.coreService.paginator;
  @Output() selectedRecordOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() displayModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() paginatorOut: EventEmitter<number> = new EventEmitter<number>();
  @Output() searchOut: EventEmitter<string> = new EventEmitter<string>();
  loaded$ = this.coreService.loaded$;
  items: MenuItem[] = [];
  search: UntypedFormControl = new UntypedFormControl('');
  progressBarDelete: boolean = false;
  selectedRecords: any[] = [];

  constructor(private coreService: CoreService, public messageService: MessageService) {
    this.search.valueChanges.pipe(debounceTime(600)).subscribe(value => {
      this.searchOut.emit(value);
    })
  }

  ngOnInit(): void {

  }

  select(record: any) {
    this.selectedRecordOut.emit(record);
    this.displayModal.emit(false);
  }

  paginate(event: any) {
    // this.paginatorIn.page = event.page + 1;
    this.paginatorOut.emit(event.page + 1);
  }

  catalogues() {

  }
}
