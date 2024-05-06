import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';
import { UserCreateModel } from '../api/models/input/create-user.input.model';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class AccountData {
  @Prop({
    required: true,
  })
  login: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  createdAt: string;

  @Prop({
    required: true,
  })
  passwordHash: string;

  @Prop({
    required: true,
  })
  recoveryCode: string;
}

const AccountDataSchema = SchemaFactory.createForClass(AccountData);

@Schema()
export class EmailConfirmation {
  @Prop({
    required: true,
  })
  confirmationCode: string;

  @Prop({
    required: true,
  })
  expirationDate: Date;

  @Prop({
    required: true,
  })
  isConfirmed: boolean;
}

const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);

@Schema()
export class User {
  _id: ObjectId;

  @Prop({
    required: true,
    type: AccountDataSchema,
  })
  accountData: AccountData;

  @Prop({
    required: true,
    type: EmailConfirmationSchema,
  })
  emailConfirmation: EmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.statics.createUser = (
  dto: UserCreateModel,
  passwordHash: string,
  UserModel: Model<UserDocument> & UserModelStaticType,
  isConfirmed: boolean,
  confirmationCode?: string,
) => {
  const user = new UserModel();

  user._id = new ObjectId();
  user.accountData = {
    login: dto.login,
    email: dto.email,
    createdAt: new Date().toISOString(),
    passwordHash: passwordHash,
    recoveryCode: uuidv4(),
  };

  user.emailConfirmation = {
    confirmationCode: confirmationCode ? confirmationCode : uuidv4(),
    expirationDate: add(new Date(), {
      hours: 1,
      minutes: 3,
    }),
    isConfirmed: isConfirmed,
  };

  return user;
};

export type UserModelStaticType = {
  createUser: (
    dto: UserCreateModel,
    passwordHash: string,
    UserModel: Model<UserDocument> & UserModelStaticType,
    isConfirmed: boolean,
    confirmationCode?: string,
  ) => {
    _id: ObjectId;
    accountData: {
      login: string;
      email: string;
      createdAt: string;
      passwordHash: string;
      recoveryCode: string;
    };
    emailConfirmation: {
      confirmationCode: string;
      expirationDate: Date;
      isConfirmed: boolean;
    };
  };
};
