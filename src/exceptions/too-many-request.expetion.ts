export class TooManyRequestsException extends Error {
  public readonly code = 429;
  constructor(message = 'There is no such user or the password does not match') {
    super(message);
  }
}
