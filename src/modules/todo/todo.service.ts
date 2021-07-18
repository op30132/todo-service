import { Model, Types } from 'mongoose';
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
    const list = await this.listService.getListById(todo.listId);
    if (!list) {
      throw new HttpException('No such list', HttpStatus.BAD_REQUEST);
    }
    const data = { 
      ...todo, 
      creator: Types.ObjectId(userId), 
      listId: Types.ObjectId(todo.listId)
    };
    const createTodo = await this.todoModel.create(data);
    return createTodo.save();
  }
  async updateTodo(todoId: string, todo: TodoDTO) {
    const data = todo.listId ? {...todo, listId: Types.ObjectId(todo.listId)}: todo;
    return await this.todoModel.findByIdAndUpdate(todoId, data, { new: true });
  }
  async deleteTodo(todoId: string): Promise<any> {
    return await this.todoModel.findByIdAndRemove(todoId);
  }
  async getAllTodoByList(listId: string) {
    const res = await this.todoModel.find({ listId: Types.ObjectId(listId) }).sort({ pos: 1 });
    return res || [];
  }
}