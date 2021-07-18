import { UseFilters } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WsResponse, WebSocketServer, MessageBody, OnGatewayConnection, ConnectedSocket, WsException, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AllExceptionsFilter } from 'src/filters/ws-exception.filter';
import { List } from '../list/schemas/list.schema';
import { Project } from '../project/schemas/project.schema';

@WebSocketGateway({transports:["websocket"]})
@UseFilters(new AllExceptionsFilter())
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;
    private userMap: Map<string, Socket> = new Map();;
    constructor() {}

    async handleConnection(socket: Socket) {
      const userId = this.getSocketUserId(socket);
      this.userMap.set(userId, socket)
      this.server.sockets.emit('send_message', "connect!!")
    }
    async handleDisconnect(socket: Socket) {
      const userId = this.getSocketUserId(socket);
      this.userMap.delete(userId);
    }
    getSocketUserId(socket: Socket) {
      const userId =  socket.handshake.auth["userId"] || null;
      if (!userId) {
        throw new WsException('Invalid credentials');
      }
      return userId;
    }
    @SubscribeMessage('inviteCoworker')
    async onInviteEvent(@MessageBody() payload:{userId: string, data: Project}, @ConnectedSocket() socket: Socket): Promise<void> {
      if(this.userMap.has(payload.userId)) {
        this.userMap.get(payload.userId).emit("getInvited", payload.data);
      }
    }
    @SubscribeMessage('removeCoworker')
    async removeCoworker(@MessageBody() payload:{projectId: string, userId: string}, @ConnectedSocket() socket: Socket): Promise<void> {
      if(this.userMap.has(payload.userId)) {
        this.userMap.get(payload.userId).emit("getRemoved", payload.projectId);
      }
    }
    @SubscribeMessage('acceptCoworker')
    async acceptCoworker(@MessageBody() projectId: string, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(projectId).emit("accentYourProject", projectId);
    }
    @SubscribeMessage('rejectCoworker')
    async rejectCoworker(@MessageBody() projectId: string, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(projectId).emit("rejectYourProject", projectId);
    }
    @SubscribeMessage('joinProject')
    async joinProject(@MessageBody() projectId: string, @ConnectedSocket() socket: Socket): Promise<void> {
      if(socket.rooms.size>1) {
        const current = Array.from(socket.rooms).filter(item => item!==socket.id);
        current.forEach(el => socket.leave(el))
      }
      socket.join(projectId);
      socket.to(projectId).emit("send_message", "somebody join room");
    }
    @SubscribeMessage('addList')
    async addList(@MessageBody() payload: {projectId: string, data: List}, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(payload.projectId).emit("listAdded", payload.data);
    }
    @SubscribeMessage('updateList')
    async updateList(@MessageBody() payload: {projectId: string, data: List}, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(payload.projectId).emit("listUpdated", payload.data);
    }
    @SubscribeMessage('deleteList')
    async deleteList(@MessageBody() payload: {listId: string, projectId: string}, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(payload.projectId).emit("listDeleted", payload.listId);
    }
    @SubscribeMessage('changeTodoinList')
    async changeList(@MessageBody() payload: {listId: string, projectId: string}, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(payload.projectId).emit("listRefresh", payload.listId);
    }
    @SubscribeMessage('changeProject')
    async changeProject(@MessageBody() projectId: string, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(projectId).emit("projectFresh", projectId);
    }
    @SubscribeMessage('sortLists')
    async sortLists(@MessageBody() payload: {listId: string, projectId: string, pos: number}, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(payload.projectId).emit("listSorted", {listId: payload.listId, pos: payload.pos});
    }
    @SubscribeMessage('sortTodosinSame')
    async sortTodosinSame(@MessageBody() payload: {projectId: string, data: sameSort}, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(payload.projectId).emit("todoSortedinSame", payload.data);
    }
    @SubscribeMessage('sortTodosinDiff')
    async sortTodosinDiff(@MessageBody() payload: {projectId: string, data: diffSort}, @ConnectedSocket() socket: Socket): Promise<void> {
        socket.to(payload.projectId).emit("todoSortedinDiff", payload.data);
    }

  }
  interface sameSort {
    todoId: string;
    listId: string;
    pos: number;
  }
  interface diffSort {
    todoId: string;
    sListId: string;
    dListId: string;
    pos: number;
  }