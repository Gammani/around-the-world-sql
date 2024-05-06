import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExpiredTokenDocument = HydratedDocument<ExpiredToken>;

@Schema()
export class ExpiredToken {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  deviceId: ObjectId;

  @Prop({
    required: true,
  })
  userId: ObjectId;

  @Prop({
    required: true,
  })
  refreshToken: string;
}

export const ExpiredTokenSchema = SchemaFactory.createForClass(ExpiredToken);
