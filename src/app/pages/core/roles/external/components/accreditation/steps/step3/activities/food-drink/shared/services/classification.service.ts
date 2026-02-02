import { Injectable } from '@angular/core';
import { CatalogueInterface } from '@utils/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  private classificationSource = new BehaviorSubject<CatalogueInterface | null>(null);
  currentClassification = this.classificationSource.asObservable();

  updateClassification(classification: CatalogueInterface) {
    this.classificationSource.next(classification);
  }
}