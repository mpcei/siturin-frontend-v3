import {PermissionModel} from './permission.model';

export interface RoleModel {
  id?: string;
  name?: string;
  code?: string;
  permissions?: PermissionModel[];
}

export interface CreateRoleDto extends Omit<RoleModel, 'id'> {
}

export interface UpdateRoleDto extends Partial<Omit<RoleModel, 'id'>> {
}

export interface ReadRoleDto extends Partial<RoleModel> {
}
