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
    termsAcceptedAt?: Date;
    securityQuestionAcceptedAt?: Date;
    passwordChanged: boolean;
}
