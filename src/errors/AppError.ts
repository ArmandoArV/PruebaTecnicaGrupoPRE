/**
 * Error de dominio normalizado: código estable + status HTTP + mensaje.
 * El middleware central lo traduce a `{ error: { code, message } }`.
 */
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(code: string, message: string): AppError {
    return new AppError(code, 400, message);
  }

  static notFound(code: string, message: string): AppError {
    return new AppError(code, 404, message);
  }
}
