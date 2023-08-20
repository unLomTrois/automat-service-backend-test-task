import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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

  async update(
    author_id: string,
    note_id: string,
    updateNoteDto: UpdateNoteDto,
  ) {
    return this.noteModel
      .findOneAndUpdate({ _id: note_id, author: author_id }, updateNoteDto, {
        new: true,
      })
      .exec();
  }

  remove(author_id: string, note_id: string) {
    return this.noteModel
      .findOneAndDelete({ _id: note_id, author: author_id })
      .exec();
  }
}
