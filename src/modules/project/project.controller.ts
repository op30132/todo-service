import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/decorators/user.decorator';
import { Role } from 'src/enum/role.enum';
import { UserDocument } from '../user/schemas/user.schema';
import { CoworkerDTO, ProjectDTO } from './dto/Project.dto';
import { ProjectService } from './project.service';

@Controller('api/project')
@UseGuards()
@UsePipes(ValidationPipe)
// @UseFilters(GlobalExceptionFilter)
export class ProjectController {
  constructor(
    private projectService: ProjectService
  ) { }

  @Post('/create')
  async create(@Body() createDTO: ProjectDTO, @User() { id }: UserDocument) {
    const res = await this.projectService.addProject(id, createDTO);
    return res;
  }

  @Get('/list')
  async findAllByUserId(@User() user: UserDocument) {
    const res = await this.projectService.getAllProjectByUser(user.id);
    return res;
  }

  @Get('/:projectId')
  async findOne(@Param('projectId') projectId) {
    const res = await this.projectService.getProject(projectId);
    return res;
  }

  @Put('/:projectId')
  @UsePipes(ValidationPipe)
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

  @Get('/:projectId/coworker')
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
