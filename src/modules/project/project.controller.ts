import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { GlobalExceptionFilter } from 'src/filters/global-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../user/schemas/user.schema';
import { CoworkerDTO, ProjectDTO } from './dto/Project.dto';
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
  async findAllByUserId(@User() user: UserDocument) {
    const res = await this.projectService.getProjectsByUser(user.id);
    return res;
  }
  @Get('/coworkerProjects')
  async findcoworkByUserId(@User() user: UserDocument) {
    const res = await this.projectService.getCoworkProjectsByUser(user.id);
    return res;
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
    const res = await this.projectService.getCoworkerList(projectId);
    return res;
  }
  @Post('/:projectId/coworker')
  async createCoworker(@Param('projectId') projectId, @Body() createDTO: CoworkerDTO) {
    const res = await this.projectService.addCoworker(projectId, createDTO.userId);
    return res;
  }
  @Delete('/:projectId/coworker/:userId')
  async removeCoworker(@Param('projectId') projectId, @Param('userId') userId) {
    const res = await this.projectService.removeCoworker(projectId, userId);
    return res;
  }
}
