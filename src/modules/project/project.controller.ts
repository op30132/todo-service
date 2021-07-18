import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { GlobalExceptionFilter } from 'src/filters/global-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../user/schemas/user.schema';
import { CoworkerDTO, InviteCoworkerDTO, ProjectDTO } from './dto/Project.dto';
import { ProjectService } from './project.service';

@Controller('api/project')
@UseFilters(GlobalExceptionFilter)
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(
    private projectService: ProjectService
  ) { }

  @Post('/create')
  async create(@Body() createDTO: ProjectDTO, @User() { id }: UserDocument) {
    const res = await this.projectService.addProject(id, createDTO);
    return res;
  }

  @Get('/myProjects')
  async findAllByUserId(@User() { id }: UserDocument) {
    const res = await this.projectService.getProjectsByUser(id);
    if (res.length === 0) {
      const newProject = await this.projectService.addProject(id, { name: "my project" })
      return [newProject];
    }
    return res;
  }
  @Get('/coworkerProjects')
  async findcoworkByUserId(@User() user: UserDocument) {
    const res = await this.projectService.getCoworkProjectsByUser(user.id);
    return res;
  }
  @Get('/invitedProjects')
  async findInvitedProjectByUser(@User() user: UserDocument) {
    const res = await this.projectService.getInvitedProjectByUser(user.id);
    return res
  }
  @Get('/:projectId')
  async findOne(@Param('projectId') projectId) {
    const res = await this.projectService.getProject(projectId);
    return res;
  }

  @Put('/:projectId')
  async update(@Param('projectId') projectId, @Body() createDTO: ProjectDTO) {
    const res = await this.projectService.updateProject(projectId, createDTO);
    if (!res) throw new NotFoundException(`EntryId ${projectId} does not exist!`);
    return res;
  }

  @Delete('/:projectId')
  async remove(@Param('projectId') projectId) {
    const res = await this.projectService.deleteProject(projectId);
    if (!res) throw new NotFoundException(`EntryId ${projectId} does not exist!`);
    return res;
  }

  @Get('/:projectId/coworkers')
  async getCoworkerList(@Param('projectId') projectId) {
    return await this.projectService.getCoworkerList(projectId);
  }
  @Post('/:projectId/coworker')
  async createCoworker(@Param('projectId') projectId, @Body() createDTO: CoworkerDTO) {
    return await this.projectService.addCoworker(projectId, createDTO.userId);
  }
  @Delete('/:projectId/coworker/:userId')
  async removeCoworker(@Param('projectId') projectId, @Param('userId') userId) {
    return await this.projectService.removeCoworker(projectId, userId);
  }
  @Post('/:projectId/coworker/invite')
  async inviteCoworker(@Param('projectId') projectId, @Body() data: InviteCoworkerDTO) {

    return await this.projectService.addInvitedUser(projectId, data.userId);
  }
  @Post('/:projectId/coworker/join')
  async joinCoworker(@Param('projectId') projectId, @User() user: UserDocument) {
    return await this.projectService.joinCoworker(projectId, user.id);
  }
  @Post('/:projectId/coworker/reject')
  async removeinvited(@Param('projectId') projectId, @User() user: UserDocument) {
    return await this.projectService.removeInvitedUser(projectId, user.id);
  }
}
