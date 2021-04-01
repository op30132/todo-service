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
import { GlobalExceptionFilter } from 'src/filters/ad-exception.filter';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { TodoService } from './todo.service';


@Controller('api/todo')
@UseFilters(GlobalExceptionFilter)
export class TodoController {
  constructor(private todoService: TodoService) { }

  @Post('/create')
  @UsePipes(ValidationPipe)
  async addTodo(@Body() createTodoDTO: CreateTodoDTO) {
    const res = await this.todoService.addTodo(createTodoDTO);
    return res;
  }

  @Get('/list')
  async getRecipes() {
    const res = await this.todoService.getAllTodo();
    return res;
  }

  @Get('/:todoId')
  async getRecipe(@Param('todoId') todoId) {
    const res = await this.todoService.getTodoById(todoId);
    if (!res) throw new NotFoundException(`EntryId ${todoId} does not exist!`);
    return res;
  }

  @Put('/update/:todoId')
  async updateRecipe(@Param('todoId') todoId, @Body() createRecipeDTO: CreateTodoDTO) {
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