import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SocketGateway } from './socket.gateway'

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
  imports: [AuthModule]
})
export class SocketModule {}
