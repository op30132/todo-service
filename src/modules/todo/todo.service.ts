import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TodoDTO } from './dto/todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { ListService } from '../list/list.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    private listService: ListService
  ) { }

  async getTodoById(todoId: string) {
    return await this.todoModel.findById(todoId).exec();
  }
  async addTodo(userId: string, todo: TodoDTO) {
    const project = await this.listService.getListById(todo.listId);
    if (!project) {
      throw new HttpException('No such project', HttpStatus.BAD_REQUEST);
    }
    const createTodo = await this.todoModel.create({ ...todo, creator: userId, list: todo.listId });
    return createTodo.save();
  }
  async updateTodo(todoId: string, todo: TodoDTO) {
    return await this.todoModel.findByIdAndUpdate(todoId, todo, { new: true });
  }
  async deleteTodo(todoId: string): Promise<any> {
    return await this.todoModel.findByIdAndRemove(todoId);
  }
  async getAllTodoByList(listId: string) {
    const res = await this.todoModel.find({ list: listId });
    return res || [];
  }
}