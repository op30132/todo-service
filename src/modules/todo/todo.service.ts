import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TodoDTO } from './dto/todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectService } from '../project/project.service';
import { Todo, TodoDocument } from './schemas/todo.schema';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    private projectService: ProjectService
  ) { }

  async getTodoById(todoId: string) {
    return await this.todoModel.findById(todoId).exec();
  }
  async addTodo(userId: string, todo: TodoDTO) {
    const project = await this.projectService.getProjectById(todo.projectId);
    if (!project) {
      throw new HttpException('No such project', HttpStatus.BAD_REQUEST);
    }
    const createTodo = await this.todoModel.create({ ...todo, creator: userId, project: todo.projectId });
    return createTodo.save();
  }
  async updateTodo(todoId: string, todo: TodoDTO) {
    return await this.todoModel.findByIdAndUpdate(todoId, todo, { new: true });
  }
  async deleteTodo(todoId: string): Promise<any> {
    return await this.todoModel.findByIdAndRemove(todoId);
  }
  async getAllTodoByProject(projectId: string) {
    const res = await this.todoModel.find({ project: projectId });
    return res || [];
  }
}