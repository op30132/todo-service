import { Req, UseGuards } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { GlobalExceptionFilter } from 'src/filters/global-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../user/schemas/user.schema';
import { TodoDTO } from './dto/todo.dto';
import { TODO } from './interfaces/todo.interface';
import { TodoService } from './todo.service';


@Controller('api/todo')
@UseGuards(JwtAuthGuard)
@UseFilters(GlobalExceptionFilter)
export class TodoController {
  constructor(private todoService: TodoService) { }

  @Post('/create')
  @UsePipes(ValidationPipe)
  async addTodo(@Body() createTodoDTO: TodoDTO, @User() { _id }: UserDocument) {
    const res = await this.todoService.addTodo(_id, createTodoDTO);
    return res;
  }

  @Get('/list')
  async getRecipes(@User() user: UserDocument) {
    const res = await this.todoService.getAllTodoByUser(user._id);
    return res;
  }

  @Get('/:todoId')
  async getRecipe(@Param('todoId') todoId) {
    const res = await this.todoService.getTodoById(todoId);
    if (!res) throw new NotFoundException(`EntryId ${todoId} does not exist!`);
    return res;
  }

  @Put('/update/:todoId')
  async updateRecipe(@Param('todoId') todoId, @Body() createRecipeDTO: TodoDTO) {
    const res = await this.todoService.updateTodo(todoId, createRecipeDTO);
    if (!res) throw new NotFoundException(`EntryId ${todoId} does not exist!`);
    return res;
  }

  @Delete('/delete/:todoId')
  async deleteRecipe(@Param('todoId') todoId) {
    const res = await this.todoService.deleteTodo(todoId);
    if (!res) throw new NotFoundException(`EntryId ${todoId} does not exist!`);
    return res;
  }
}