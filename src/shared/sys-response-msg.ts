
export class SysResponseMsg {

  code: Number;
  message: string;

  constructor(code: Number, message = 'success') {
    this.code = code;
    this.message = message;
  }
}