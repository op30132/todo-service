import { Bind, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { GlobalExceptionFilter } from 'src/filters/global-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../user/schemas/user.schema';
import { TodoDTO, TodoUpdateDTO } from './dto/todo.dto';
import { TodoService } from './todo.service';


@Controller('api/todo')
@UseGuards(JwtAuthGuard)
@UseFilters(GlobalExceptionFilter)
export class TodoController {
  constructor(private todoService: TodoService) { }

  @Post('/create')
  async addTodo(@Body() createDTO: TodoDTO, @User() { id }: UserDocument) {
    const res = await this.todoService.addTodo(id, createDTO);
    return res;
  }

  @Get('/all/:listId')
  async getTodoList(@Param('listId') listId: string) {
    if (!listId) {
      throw new HttpException('no such listId', HttpStatus.BAD_REQUEST);;
    }
    const res = await this.todoService.getAllTodoByList(listId);
    return res;
  }

  @Get('/:todoId')
  async getTodo(@Param('todoId') todoId) {
    const res = await this.todoService.getTodoById(todoId);
    if (!res) throw new NotFoundException(`EntryId ${todoId} does not exist!`);
    return res;
  }

  @Put('/:todoId')
  async updateTodo(@Param('todoId') todoId, @Body() updateDTO: TodoUpdateDTO) {
    const res = await this.todoService.updateTodo(todoId, updateDTO);
    if (!res) throw new NotFoundException(`EntryId ${todoId} does not exist!`);
    return res;
  }

  @Delete('/:todoId')
  async deleteTodo(@Param('todoId') todoId) {
    const res = await this.todoService.deleteTodo(todoId);
    if (!res) throw new NotFoundException(`EntryId ${todoId} does not exist!`);
    return res;
  }
}