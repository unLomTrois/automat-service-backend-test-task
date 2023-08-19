import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name)
    private noteModel: Model<Note>,
  ) {}

  create(dto: CreateNoteDto) {
    return this.noteModel.create(dto);
  }

  findAll() {
    return this.noteModel.find().populate('author').exec();
  }

  async findByAuthor(id: string): Promise<Note[]> {
    return this.noteModel.find({ author: { _id: id } }).exec();
  }

  findOne(id: string) {
    return this.noteModel.findById(id).exec();
  }

  update(id: string, updateNoteDto: UpdateNoteDto) {
    return this.noteModel.findByIdAndUpdate(id, updateNoteDto).exec();
  }

  remove(id: string) {
    return this.noteModel.findByIdAndDelete(id).exec();
  }
}
