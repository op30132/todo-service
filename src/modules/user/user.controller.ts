import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { GlobalExceptionFilter } from "src/filters/global-exception.filter";
import { UserDocument } from "./schemas/user.schema";
import { UserService } from "./user.service";


@Controller('api/user')
@UseFilters(GlobalExceptionFilter)
export class UserController {
  constructor(
    private userService: UserService,
  ) { }

  
  @Post('query')
  async getUserPtofile(@Body('email') email: string): Promise<UserDocument[]> {
    return await this.userService.findByQuery({email});
  }
}