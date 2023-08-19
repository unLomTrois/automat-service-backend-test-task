import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop({ select: false })
  password: string;

  // @Prop({ type: [Types.ObjectId], ref: 'Note' })
  // notes: Note[];
}

export const UserSchema = SchemaFactory.createForClass(User);
