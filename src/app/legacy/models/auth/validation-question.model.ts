import {UserModel} from "@models/auth/user.model";

export interface ValidationQuestionModel {
  id: string;
  user: UserModel;
  code: string;
  question: string;
  response: string;
}
