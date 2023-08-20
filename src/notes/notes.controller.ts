import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from 'src/user/schemas/user.schema';
import { Note } from './schemas/note.schema';
import { ObjectId } from 'mongoose';

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

@ApiTags('Notes')
@Controller('notes')
@UseGuards(JwtGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(
    @Req() request: Request & { user: User },
    @Body() createNoteDto: CreateNoteDto,
  ) {
    const { _id } = request.user;
    console.log(_id, request.user);
    // return 'cringe';
    return this.notesService.create(_id, createNoteDto);
  }

  @Get()
  async findAll() {
    await sleep(2000);
    return this.notesService.findAll();
  }

  @Get('author/:id')
  async findByAuthor(@Param('id') id: string) {
    await sleep(2000);

    return this.notesService.findByAuthor(id);
  }

  @Get('me')
  async findByMe(@Req() req: Request & { user: User }): Promise<Note[]> {
    const { _id } = req.user;
    await sleep(2000);

    return this.notesService.findByAuthor(_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    await sleep(2000);

    return this.notesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: User },
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    await sleep(2000);
    const { user } = req;
    return this.notesService.update(user._id, id, updateNoteDto);
  }

  @Delete(':id')
  async remove(@Req() req: Request & { user: User }, @Param('id') id: string) {
    const { user } = req;

    await sleep(2000);

    console.log('delete note', user._id, id);

    return this.notesService.remove(user._id, id);
  }
}
