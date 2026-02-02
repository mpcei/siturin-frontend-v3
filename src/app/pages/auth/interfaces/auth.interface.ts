import { RoleInterface } from '@modules/auth/interfaces';

export interface AuthInterface {
    id: string;
    roles?: RoleInterface[];
    avatar?: string;
    email: string;
    emailVerifiedAt?: Date;
    lastname?: string;
    name?: string;
    identification?: string;
    username: string;
    termsConditions?: boolean;
    securityQuestionAcceptedAt?: Date;
    passwordChanged: boolean;
}
