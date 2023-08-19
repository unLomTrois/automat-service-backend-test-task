import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type UserDocument = HydratedDocument<Note>;

@Schema({
  timestamps: {
    createdAt: 'timestamp',
    updatedAt: undefined,
  },
})
export class Note {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ default: Date.now() })
  timestamp: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  author: User;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
