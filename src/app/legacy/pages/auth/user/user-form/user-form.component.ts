import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateUserDto, RoleModel, UpdateUserDto} from '@models/auth';
import {CatalogueModel} from '@models/core';
import {AuthHttpService, UsersHttpService} from '@services/auth';
import {BreadcrumbService, CataloguesHttpService, CoreService, MessageService} from '@services/core';
import {OnExitInterface} from '@shared/interfaces';
import {RolesHttpService} from "@services/auth/roles-http.service";
import { NgIf, AsyncPipe } from '@angular/common';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { PrimeTemplate } from 'primeng/api';
import { Divider } from 'primeng/divider';
import { LabelDirective } from '../../../../shared/directives/label.directive';
import { MultiSelect } from 'primeng/multiselect';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { InputText } from 'primeng/inputtext';
import { KeyFilter } from 'primeng/keyfilter';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { PasswordDirective } from 'primeng/password';
import { Checkbox } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [NgIf, SkeletonComponent, Bind, Panel, PrimeTemplate, Divider, ReactiveFormsModule, LabelDirective, MultiSelect, ErrorMessageDirective, InputText, KeyFilter, ToggleSwitch, PasswordDirective, Checkbox, ButtonDirective, Ripple, AsyncPipe]
})
export class UserFormComponent implements OnInit, OnExitInterface {
  id: string = '';
  bloodTypes: CatalogueModel[] = [];
  roles: RoleModel[] = [];
  form: UntypedFormGroup = this.newForm;
  panelHeader: string = 'Create User';
  isChangePassword: UntypedFormControl = new UntypedFormControl(false);
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;

  constructor(
    private authHttpService: AuthHttpService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private cataloguesHttpService: CataloguesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    private router: Router,
    private rolesHttpService: RolesHttpService,
    private usersHttpService: UsersHttpService,
  ) {
    this.breadcrumbService.setItems([
      {label: 'Users', routerLink: ['/administration/users']},
      {label: 'Form'},
    ]);

    if (activatedRoute.snapshot.params['id'] !== 'new') {
      this.id = activatedRoute.snapshot.params['id'];
      this.panelHeader = 'Update User';
    }
  }

  async onExit(): Promise<boolean> {
    if (this.form.touched || this.form.dirty) {
      return await this.messageService.questionOnExit().then(result => result.isConfirmed);
    }
    return true;
  }

  ngOnInit(): void {
    this.loadRoles();
    if (this.id != '') {
      this.getUser();
      this.passwordField.clearValidators();
    } else {
      this.isChangePassword.setValue(true);
      this.passwordField.enable();
      this.passwordChangedField.enable();
    }
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      lastname: [null, [Validators.required]],
      name: [null, [Validators.required]],
      password: [{value: null, disabled: true}, [Validators.required, Validators.minLength(8)]],
      passwordChanged: [{value: true, disabled: true}],
      roles: [null, [Validators.required]],
      username: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.id != '') {
        this.update(this.form.value);
      } else {
        this.create(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  back(): void {
    this.router.navigate(['/administration/users']);
  }

  create(user: CreateUserDto): void {
    user.passwordChanged = !user.passwordChanged;
    this.usersHttpService.create(user).subscribe(user => {
      this.form.reset(user);
      this.back();
    });
  }

  loadRoles(): void {
    this.rolesHttpService.findAll().subscribe((roles) => this.roles = roles);
  }

  getUser(): void {
    this.isLoadingSkeleton = true;
    this.usersHttpService.findOne(this.id).subscribe((user) => {
      this.isLoadingSkeleton = false;
      this.form.patchValue(user);
    });
  }

  handleChangePassword(event: any) {
    this.isChangePassword.setValue(event.checked);
    if (this.isChangePassword.value) {
      this.passwordChangedField.enable();
      this.passwordField.enable();
      this.passwordField.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      this.passwordChangedField.setValue(false);
      this.passwordChangedField.disable();
      this.passwordField.setValue(null);
      this.passwordField.disable();
      this.passwordField.clearValidators();
    }
    this.passwordField.updateValueAndValidity();
  }

  update(user: UpdateUserDto): void {
    user.passwordChanged = !user.passwordChanged;

    this.usersHttpService.update(this.id, user).subscribe((user) => {
      this.form.reset(user);
      this.back()
    });
  }

  get emailField(): AbstractControl {
    return this.form.controls['email'];
  }

  get lastnameField(): AbstractControl {
    return this.form.controls['lastname'];
  }

  get nameField(): AbstractControl {
    return this.form.controls['name'];
  }

  get passwordField(): AbstractControl {
    return this.form.controls['password'];
  }

  get passwordChangedField(): AbstractControl {
    return this.form.controls['passwordChanged'];
  }

  get rolesField(): FormArray {
    return this.form.controls['roles'] as FormArray;
  }

  get usernameField(): AbstractControl {
    return this.form.controls['username'];
  }
}

