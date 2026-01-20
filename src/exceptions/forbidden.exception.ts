// будет использоваться в будущем, когда клиент аутентифицирован, но не авторизован
export class ForbiddenException extends Error {
  public readonly code = 403;

  constructor(message = 'Forbidden') {
    super(message);
  }
}
