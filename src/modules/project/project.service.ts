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
    const project = await this.ProjectModel.findById(Types.ObjectId(ProjectId));
    if (!project) throw new NotFoundException(`EntryId ${ProjectId} does not exist!`);
    return project;
  }
  async getProject(ProjectId: string) {
    const project = await this.getProjectById(ProjectId);
    const res = await project.populate('coworker').populate('invitingUser').execPopulate();
    return res;
  }
  async addProject(userId: string, Project: ProjectDTO) {
    const createProject = await this.ProjectModel.create({ ...Project, owner: new Types.ObjectId(userId) });
    return createProject.toObject();
  }
  async updateProject(projectId: string, Project: ProjectDTO) {
    return await this.ProjectModel.findByIdAndUpdate(Types.ObjectId(projectId), Project, {new: true});
  }
  async deleteProject(projectId: string): Promise<any> {
    return await this.ProjectModel.findByIdAndRemove(Types.ObjectId(projectId));
  }
  async getProjectsByUser(userId: string): Promise<Project[]> {
    const project = await this.ProjectModel.find({ owner: Types.ObjectId(userId)}).populate('coworker').populate('invitingUser');
    return project || [];
  }
  async getCoworkProjectsByUser(userId: string) {
    const project = await this.ProjectModel.find({ coworker: Types.ObjectId(userId)}).populate('coworker').populate('invitingUser');
    return project || [];
  }
  async getInvitedProjectByUser(userId: string) {
    const project = await this.ProjectModel.find({ invitingUser: Types.ObjectId(userId)});
    return project || [];
  }
  async getCoworkerList(projectId: string) {
    const project = await this.getProjectById(projectId);
    const res = await project.populate({
      path: 'coworker',
      options: { retainNullValues: true }
    }).execPopulate();
    return res.coworker;
  }
  async addCoworker(projectId: string, userId: string) {
    const project = await this.getProjectById(projectId);
    const user = await this.userService.findOne(Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException(`EntryId ${userId} does not exist!`);
    }
    const res = this.ProjectModel.findByIdAndUpdate(projectId,
      { $push: { coworker: Types.ObjectId(userId) } }, { upsert: true, new: true }
    ).populate('coworker').populate('invitingUser');;
    return res;
  }
  async removeCoworker(projectId: string, userId: string) {
    const project = await this.getProjectById(projectId);
    if (!project.coworker.includes(Types.ObjectId(userId))) {
      throw new NotFoundException(`${userId} does not exist in coworker!`);
    }
    const res = this.ProjectModel.findByIdAndUpdate(projectId,
      { $pull: { coworker: Types.ObjectId(userId) }}, { new: true }
    ).populate('coworker').populate('invitingUser');
    return res;
  }
  async addInvitedUser(projectId: string, userId: string) {
    const project = await this.getProjectById(projectId);
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`user ${userId} does not exist!`);
    }
    const res = this.ProjectModel.findByIdAndUpdate(projectId, 
      { $push: { invitingUser: Types.ObjectId(userId)}}, { new: true }
    ).populate('coworker').populate('invitingUser');
    return res;
  }
  async joinCoworker(projectId: string, userId: string) {
    const project = await this.getProjectById(projectId);
    if (!project.invitingUser.some(el => el.equals(userId))) {
      throw new NotFoundException(`${userId} is not invited!`);
    }
    const res = this.ProjectModel.findByIdAndUpdate(projectId, 
      { 
        $pull: { invitingUser: Types.ObjectId(userId)},
        $push: { coworker : Types.ObjectId(userId)},
      }, { new: true }
    ).populate('coworker').populate('invitingUser');
    return res;
  }
  async removeInvitedUser(projectId: string, userId: string) {
    const project = await this.getProjectById(projectId);
    if (!project.invitingUser.some(el => el.equals(userId))) {
      throw new NotFoundException(`${userId} is not invited!`);
    }
    const res = this.ProjectModel.findByIdAndUpdate(projectId, { 
        $pull: { invitingUser: Types.ObjectId(userId) 
      }}, { new: true }
    ).populate('coworker').populate('invitingUser');
    return res;
  }

}