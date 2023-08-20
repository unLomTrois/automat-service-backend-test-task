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

@ApiTags('Notes')
@Controller('notes')
@UseGuards(JwtGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Get('author/:id')
  findByAuthor(@Param('id') id: string) {
    return this.notesService.findByAuthor(id);
  }

  @Get('me')
  findByMe(@Req() req: Request & { user: User }): Promise<Note[]> {
    const { _id } = req.user;

    return this.notesService.findByAuthor(_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Req() req: Request & { user: User },
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const { user } = req;
    return this.notesService.update(user._id, id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Req() req: Request & { user: User }, @Param('id') id: string) {
    const { user } = req;

    return this.notesService.remove(user._id, id);
  }
}
