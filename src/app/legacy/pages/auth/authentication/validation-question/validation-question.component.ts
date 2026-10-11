import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {AuthHttpService} from "@services/auth";
import {MessageService} from '@services/core';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { NgIf, NgFor } from '@angular/common';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-validation-question',
    templateUrl: './validation-question.component.html',
    styleUrls: ['./validation-question.component.scss'],
    imports: [Bind, Card, NgIf, ReactiveFormsModule, Divider, NgFor, InputText]
})
export class ValidationQuestionComponent implements OnInit {
  @Output() dataOut = new EventEmitter<any>();
  @Input() ruc!: string;

  form!: FormGroup;
  validationQuestions: any[] = [];
  msg!: string;

  constructor(private formBuilder: FormBuilder, private authHttpService: AuthHttpService, private messageService: MessageService) {
    this.buildForm();
  }

  ngOnInit(): void {
    if (this.ruc) {
      this.getValidationQuestions();
    } else {
      this.initValidationQuestions();
    }
  }

  getValidationQuestions() {
    return this.authHttpService.getValidationQuestions(this.ruc).subscribe(response => {
      this.validationQuestions = response;

      if (this.validationQuestions.length == 0) {
        this.msg = 'No cuenta con preguntas de seguridad registradas. Por favor solicite el cambio de correo, adjuntando su cédula de ciudadanía, al correo tecnologia@produccion.gob.ec.'
      }

      const validationQuestions = this.validationQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 1);

      for (const validationQuestion of validationQuestions)
        this.addQuestion(validationQuestion);
    });
  }

  initValidationQuestions() {
    this.validationQuestions.push(
      {
        code: '1',
        question: '¿Cuál es su operadora de celular?',
      },
      {
        code: '2',
        question: '¿Cuál es el nombre de su mascota?',
      },
      {
        code: '3',
        question: '¿Cuál es la marca de su vehículo?',
      },
      {
        code: '4',
        question: '¿Cuál es el segundo nombre de su madre?',
      },
      {
        code: '5',
        question: '¿Cuál es el nombre de su abuela materna?',
      },
      {
        code: '6',
        question: '¿Cuál es el nombre de abuela paterna?',
      },
      {
        code: '7',
        question: '¿Cuál es el nombre de su papá?',
      },
      {
        code: '8',
        question: '¿En qué cuidad nació su papá?',
      },
      {
        code: '9',
        question: '¿Cuál es el nombre de su mamá?',
      },
      {
        code: '10',
        question: '¿En qué ciudad nació su mamá?',
      },
    );

    const validationQuestions = this.validationQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    for (const validationQuestion of validationQuestions)
      this.addQuestion(validationQuestion);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      questions: this.formBuilder.array([]),
    });

    this.form.valueChanges.subscribe(value => {
      if (this.form.valid)
        this.dataOut.emit(this.questionsField.value);
      else
        this.dataOut.emit([]);
    });
  }

  addQuestion(validationQuestion: any) {
    const questionForm = this.formBuilder.group({
      code: [validationQuestion.code, Validators.required],
      question: [validationQuestion.question, Validators.required],
      response: ['', [Validators.required, Validators.pattern(/^\S*$/), Validators.minLength(3), Validators.maxLength(30)]],
    });

    this.questionsField.push(questionForm);
  }

  onSubmit() {

  }

  get questionsField() {
    return this.form.get('questions') as FormArray;
  }
}
