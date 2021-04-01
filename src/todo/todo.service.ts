import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { TODO } from './interfaces/todo.interface';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GetTodoFilterDTO } from './dto/get-todo-filter.tdo';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel('Todo')
    private todoModel: Model<TODO>,
  ) { }

  async getTodoById(todoId: string): Promise<TODO> {
    const recipe = await this.todoModel.findById(todoId).exec();
    return recipe;
  }
  async addTodo(createTodoDTO: CreateTodoDTO): Promise<TODO> {
    const createTodo = new this.todoModel(createTodoDTO);
    return createTodo.save();
  }
  async updateTodo(todoId: string, createTodoDTO: CreateTodoDTO): Promise<TODO> {
    const updatedTodo = await this.todoModel.findByIdAndUpdate(todoId, createTodoDTO, { new: true });
    return updatedTodo;
  }
  async deleteTodo(todoId: string): Promise<any> {
    const deletedRecipe = await this.todoModel.findByIdAndRemove(todoId);
    return deletedRecipe;
  }
  async getAllTodo(): Promise<TODO[]> {
    return await this.todoModel.find().exec();
  }
}