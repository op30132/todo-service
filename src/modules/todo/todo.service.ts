import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { TODO } from './interfaces/todo.interface';
import { TodoDTO } from './dto/todo.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel('Todo')
    private todoModel: Model<TODO>,
  ) { }

  async getTodoById(todoId: string): Promise<TODO> {
    return await this.todoModel.findById(todoId).exec();
  }
  async addTodo(uuid: string, todo: TodoDTO): Promise<TODO> {
    const createTodo = await this.todoModel.create({ ...todo, creator: uuid });
    return createTodo.save();
  }
  async updateTodo(todoId: string, todo: TodoDTO): Promise<TODO> {
    return await this.todoModel.findByIdAndUpdate(todoId, todo, { new: true });
  }
  async deleteTodo(todoId: string): Promise<any> {
    return await this.todoModel.findByIdAndRemove(todoId);
  }
  async getAllTodoByUser(uuid: string): Promise<TODO[]> {
    return await this.todoModel.find({ creator: uuid }).populate('user');
  }
}