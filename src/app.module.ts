import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './modules/todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['environments/.env'],
      load: [appConfig],
      expandVariables: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('uri'),
      }),
      inject: [ConfigService],
    }),
    TodoModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
