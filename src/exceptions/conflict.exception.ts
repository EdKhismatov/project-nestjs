// будет использоваться в будущем, когда пользователь пытается зарегистрироваться на ту почту, которая уже существует
export class ConflictException extends Error {
  public readonly code = 409;
  constructor(message = 'A user with this login already exists.') {
    super(message);
  }
}
