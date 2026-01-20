// будет использоваться в будущем, когда клиент не аутентифицирован
export class UnauthorizedException extends Error {
  public readonly code = 401;
  constructor(message = 'There is no such user or the password does not match') {
    super(message);
  }
}
