import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectDTO } from './dto/Project.dto';
import { Project, ProjectDocument } from './schemas/project.schema';
import { SysResponseMsg } from 'src/shared/sys-response-msg';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private ProjectModel: Model<ProjectDocument>,
    private userService: UserService
  ) { }
  async getProjectById(ProjectId: string) {
    const project = await this.ProjectModel.findById(ProjectId);
    if (!project) throw new NotFoundException(`EntryId ${ProjectId} does not exist!`);
    return project;
  }
  async getProject(ProjectId: string) {
    const project = await this.getProjectById(ProjectId);
    const res = await project.populate('owner').execPopulate();
    return res;
  }
  async addProject(userId: string, Project: ProjectDTO) {
    const createProject = await this.ProjectModel.create({ ...Project, owner: userId });
    createProject.save();
    return createProject;
  }
  async updateProject(ProjectId: string, Project: ProjectDTO) {
    return await this.ProjectModel.findByIdAndUpdate(ProjectId, Project);
  }
  async deleteProject(ProjectId: string): Promise<any> {
    return await this.ProjectModel.findByIdAndRemove(ProjectId);
  }
  async getAllProjectByUser(userId: string) {
    const project = await this.ProjectModel.find({ owner: userId });
    return project || [];
  }

  async getCoworkerList(ProjectId: string) {
    const project = await this.getProjectById(ProjectId);
    const res = await project.populate({
      path: 'coworker',
      options: { retainNullValues: true }
    }).execPopulate();
    return res.coworker;
  }
  async addCoworker(ProjectId: string, userId: string) {
    const project = await this.getProjectById(ProjectId);
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`EntryId ${userId} does not exist!`);
    }
    await project.updateOne(
      { $push: { coworker: userId } }, { upsert: true, new: true }
    );
    return project;
  }
  async removeCoworker(ProjectId: string, userId: string) {
    const project = await this.getProjectById(ProjectId);
    if (!project.coworker.includes(userId)) {
      throw new NotFoundException(`${userId} does not exist in coworker!`);
    }
    await project.updateOne(
      { $pull: { coworker: userId } }
    );
    return new SysResponseMsg(200, 'delete successfully');
  }

}