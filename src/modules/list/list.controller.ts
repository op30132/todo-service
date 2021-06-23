import { Bind, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { GlobalExceptionFilter } from 'src/filters/global-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../user/schemas/user.schema';
import { ListDTO } from './dto/List.dto';
import { ListService } from './list.service';


@Controller('api/list')
@UseGuards(JwtAuthGuard)
@UseFilters(GlobalExceptionFilter)
export class ListController {
  constructor(private listService: ListService) { }

  @Post('/create')
  async addTodo(@Body() createDTO: ListDTO, @User() { id }: UserDocument) {
    const res = await this.listService.addList(id, createDTO);
    return res;
  }

  @Get('/all/:projectId')
  async getTodoList(@Param('projectId') projectId: string) {
    if (!projectId) {
      throw new HttpException('no projectId', HttpStatus.BAD_REQUEST);;
    }
    const res = await this.listService.getAllListByProject(projectId);
    return res;
  }

  @Get('/:listId')
  async getTodo(@Param('listId') listId) {
    const res = await this.listService.getListById(listId);
    if (!res) throw new NotFoundException(`EntryId ${listId} does not exist!`);
    return res;
  }

  @Put('/:listId')
  async updateTodo(@Param('listId') listId, @Body() createDTO: ListDTO) {
    const res = await this.listService.updateList(listId, createDTO);
    if (!res) throw new NotFoundException(`EntryId ${listId} does not exist!`);
    return res;
  }

  @Delete('/:listId')
  async deleteTodo(@Param('listId') listId) {
    const res = await this.listService.deleteList(listId);
    if (!res) throw new NotFoundException(`EntryId ${listId} does not exist!`);
    return res;
  }
}