import {Component, OnInit} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UpdateUserDto} from '@models/auth';
import {AuthHttpService, AuthService} from '@services/auth';
import {BreadcrumbService, CataloguesHttpService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {DateFormatPipe} from "@shared/pipes";
import { NgIf } from '@angular/common';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { LabelDirective } from '../../../../shared/directives/label.directive';
import { Bind } from 'primeng/bind';
import { InputText } from 'primeng/inputtext';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-user-information',
    templateUrl: './user-information.component.html',
    styleUrls: ['./user-information.component.scss'],
    imports: [NgIf, SkeletonComponent, ReactiveFormsModule, LabelDirective, Bind, InputText, ErrorMessageDirective, ButtonDirective, Ripple]
})
export class UserInformationComponent implements OnInit, OnExitInterface {
  dateFormat = new DateFormatPipe();
  emailVerifiedAt: Date | null = null;
  formUser: FormGroup = this.newUserForm;
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private authHttpService: AuthHttpService,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private coreService: CoreService,
    private formBuilder: FormBuilder,
    public messageService: MessageService,
  ) {
  }

  async onExit(): Promise<boolean> {
    if (this.formUser.touched || this.formUser.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    // this.getUserInformation();
    this.emailField.patchValue(this.authService.auth.email);
    this.nameField.patchValue(this.authService.auth.name);
    this.identificationField.patchValue(this.authService.auth.identification);
  }

  get newUserForm(): FormGroup {
    return this.formBuilder.group({
      email: [{value: null, disabled: true}, [Validators.required, Validators.email]],
      phone: [null, []],
      identification: [{value: null, disabled: true}, [Validators.required]],
      name: [{value: null, disabled: true}, [Validators.required]],
      // roles: [['admin'], []],
      username: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });
  }

  onSubmitUserInformation(): void {
    if (this.formUser.valid) {
      this.updateUserInformation(this.formUser.value);
    } else {
      this.formUser.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  getUserInformation(): void {
    this.isLoadingSkeleton = true;
    this.authHttpService.getUserInformation().subscribe((user) => {
        this.isLoadingSkeleton = false;
        this.formUser.patchValue(user);
        this.emailVerifiedAt = user.emailVerifiedAt;
      }
    );
  }

  updateUserInformation(user: UpdateUserDto): void {
    this.authHttpService.updateUserInformation(user).subscribe((user) => {
      this.formUser.reset(user);
      this.authService.auth = user;
    });
  }

  get emailField(): AbstractControl {
    return this.formUser.controls['email'];
  }

  get phoneField(): AbstractControl {
    return this.formUser.controls['phone'];
  }

  get usernameField(): AbstractControl {
    return this.formUser.controls['username'];
  }

  get nameField(): AbstractControl {
    return this.formUser.controls['name'];
  }

  get identificationField(): AbstractControl {
    return this.formUser.controls['identification'];
  }
}

