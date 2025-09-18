export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const createBadRequest = (message: string, code = 'bad_request'): AppError =>
  new AppError(400, code, message);

export const createUnauthorized = (message: string, code = 'unauthorized'): AppError =>
  new AppError(401, code, message);

export const createNotFound = (message: string, code = 'not_found'): AppError =>
  new AppError(404, code, message);

export const createConflict = (message: string, code = 'conflict'): AppError =>
  new AppError(409, code, message);
