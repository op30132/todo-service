
export class SysResponseMsg {

  code: string;
  message: string;

  constructor(code: string, message = 'success') {
    this.code = code;
    this.message = message;
  }
}