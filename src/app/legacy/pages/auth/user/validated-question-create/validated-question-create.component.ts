import {Component, OnInit} from '@angular/core';
import {AuthHttpService, AuthService} from '@services/auth';
import {ValidationQuestionModel} from "@models/auth/validation-question.model";
import {Router} from "@angular/router";
import { MessageService} from '@services/core';
import { NgIf } from '@angular/common';
import { Bind } from 'primeng/bind';
import { Dialog } from 'primeng/dialog';
import { ValidationQuestionComponent } from '../../authentication/validation-question/validation-question.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-validated-question-create',
    templateUrl: './validated-question-create.component.html',
    styleUrls: ['./validated-question-create.component.scss'],
    imports: [NgIf, Bind, Dialog, ValidationQuestionComponent, ButtonDirective, Ripple]
})
export class ValidatedQuestionCreateComponent implements OnInit {
  isModalVisible: boolean = true;
  cargando: boolean = false;
  validationQuestions: ValidationQuestionModel[] = [];

  constructor(private authHttpService: AuthHttpService, private authService: AuthService, private router: Router) {


  }

  ngOnInit(): void {
  }

  checkValidationQuestions(validationQuestions: ValidationQuestionModel[]) {
    this.validationQuestions = validationQuestions;
  }

  saveValidationQuestions() {
    this.cargando = true;

    this.authHttpService.createValidationQuestions(this.validationQuestions).subscribe(res => {
      this.isModalVisible = false;
      this.cargando = false;
      this.authService.auth = {...this.authService.auth, validatedQuestions: true}
      this.router.navigate(['/siturin/externo/establecimientos']);
    }, error => {
      this.cargando = false;
    });
  }
}
