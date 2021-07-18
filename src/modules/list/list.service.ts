import { Model, Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ListDTO, ListUpdateDTO } from './dto/List.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectService } from '../project/project.service';
import { List, ListDocument } from './schemas/list.schema';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private listModel: Model<ListDocument>,
    private projectService: ProjectService
  ) { }

  async getListById(listId: string) {
    return await this.listModel.findById(listId).exec();
  }
  async addList(userId: string, list: ListDTO) {
    const project = await this.projectService.getProjectById(list.projectId);
    if (!project) {
      throw new HttpException('No such project', HttpStatus.BAD_REQUEST);
    }
    const data = {
      ...list,
      creator: Types.ObjectId(userId), 
      projectId: Types.ObjectId(list.projectId)
    }
    const createlist = await this.listModel.create(data);
    return createlist.save();
  }
  async updateList(listId: string, list: ListUpdateDTO) {
    const data = list.projectId ? {...list, projectId: Types.ObjectId(list.projectId)} : list;
    return await this.listModel.findByIdAndUpdate(listId, data, { new: true });
  }
  async deleteList(listId: string): Promise<any> {
    return await this.listModel.findByIdAndRemove(listId);
  }
  async getAllListByProject(projectId: string) {
    const res = this.listModel.find({projectId: Types.ObjectId(projectId)}).sort({pos: 1}).populate('todos');
    return res || [];
  }
}