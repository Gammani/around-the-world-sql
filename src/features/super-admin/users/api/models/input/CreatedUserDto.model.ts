import { UserCreateModelType } from './create-user.input.model';

export type CreatedUserDtoModel = {
  inputUserModel: UserCreateModelType;
  passwordHash: string;
  isConfirmed: boolean;
};
