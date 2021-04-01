import { HttpException } from "@nestjs/common";
import { SysResponseMsg } from "../shared/sys-response-msg";

export class ErrorException extends HttpException {
  errCode: string;

  constructor(errCode: string, msg: string) {
    const respCode = new SysResponseMsg(errCode, msg);
    super(respCode, 200)
    this.errCode = errCode;
  }
}