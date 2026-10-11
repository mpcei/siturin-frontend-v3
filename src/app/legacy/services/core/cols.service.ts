import {Injectable} from '@angular/core';
import {ColumnModel} from "@models/core";

@Injectable({
  providedIn: 'root'
})

export class ColsService {
  constructor() {
  }

  get catalogue(): ColumnModel[] {
    return [
      {field: 'name', header: 'Nombre'},
      {field: 'description', header: 'Descripción'},
    ];
  }
}
