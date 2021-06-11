import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from '../project/project.module';
import { UsersModule } from '../user/users.module';
import { List, ListSchema } from './schemas/list.schema';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [
    UsersModule,
    ProjectModule,
    MongooseModule.forFeature([{ name: List.name, schema: ListSchema }])
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule { }