import {RoleModel} from '@models/auth';
import {CatalogueModel} from '@models/core';

export interface UserModel {
  id: string;
  identificationType: CatalogueModel;
  sex: CatalogueModel;
  gender: CatalogueModel;
  ethnicOrigin: CatalogueModel;
  bloodType: CatalogueModel;
  bloodTypeId: CatalogueModel;
  maritalStatus: CatalogueModel;
  phones: CatalogueModel[];
  emails: CatalogueModel[];
  roles: RoleModel[];
  avatar: string;
  birthdate: string;
  email: string;
  emailVerifiedAt: Date;
  identification: string;
  lastname: string;
  maxAttempts: number;
  name: string;
  password: string;
  passwordChanged: boolean;
  phone: string;
  suspendedAt: Date;
  username: string;
  validatedQuestions: boolean;
}

export interface CreateUserDto extends Omit<UserModel, 'id'> {
}

export interface UpdateUserDto extends Partial<Omit<UserModel, 'id'>> {
}

export interface SelectUserDto extends Partial<UserModel> {
}
