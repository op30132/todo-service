import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../user/schemas/user.schema';
import { PROJECT } from './interfaces/Project.interface';
import { ProjectDTO } from './dto/Project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project')
    private ProjectModel: Model<PROJECT>,
  ) { }

  async getProjectById(ProjectId: string): Promise<PROJECT> {
    return await this.ProjectModel.findById(ProjectId).exec();
  }
  async addProject(uuid: string, Project: ProjectDTO): Promise<PROJECT> {
    const createProject = await this.ProjectModel.create({ ...Project, creator: uuid });
    return createProject.save();
  }
  async updateProject(ProjectId: string, Project: ProjectDTO): Promise<PROJECT> {
    return await this.ProjectModel.findByIdAndUpdate(ProjectId, Project, { new: true });
  }
  async deleteProject(ProjectId: string): Promise<any> {
    return await this.ProjectModel.findByIdAndRemove(ProjectId);
  }
  async getAllProjectByUser(uuid: string): Promise<PROJECT[]> {
    return await this.ProjectModel.find({ creator: uuid }).populate('user');
  }
}