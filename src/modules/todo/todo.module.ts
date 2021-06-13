import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListModule } from '../list/list.module';
import { UsersModule } from '../user/users.module';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [
    UsersModule,
    ListModule,
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }])
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule { }