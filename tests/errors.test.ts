import request from "supertest";
import { app } from "../src/app";
import { errorHandler } from "../src/middleware/errorHandler";
import { AppError } from "../src/errors/AppError";

// Silenciar el logger de errores durante los tests de fallo.
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => undefined);
  jest.spyOn(console, "warn").mockImplementation(() => undefined);
});
afterAll(() => jest.restoreAllMocks());

describe("failure cases (normalized error shape)", () => {
  it("400 INVALID_ID: id no entero", async () => {
    const res = await request(app).get("/api/category/abc");
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: "INVALID_ID",
      message: expect.any(String),
    });
  });

  it("404 CATEGORY_NOT_FOUND: id inexistente", async () => {
    const res = await request(app).get("/api/category/999");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("CATEGORY_NOT_FOUND");
  });

  it("404 ROUTE_NOT_FOUND: ruta desconocida", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("ROUTE_NOT_FOUND");
  });

  it("400 BAD_REQUEST: JSON malformado en el body", async () => {
    const res = await request(app)
      .post("/api/analyze")
      .set("Content-Type", "application/json")
      .send('{"id": 1,'); // JSON inválido
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("BAD_REQUEST");
  });

  it("todas las respuestas de error comparten la forma { error: { code, message } }", async () => {
    const paths = ["/api/category/abc", "/api/category/999", "/api/nope"];
    for (const p of paths) {
      const res = await request(app).get(p);
      expect(res.body).toHaveProperty("error.code");
      expect(res.body).toHaveProperty("error.message");
    }
  });
});

describe("errorHandler: error no controlado -> 500", () => {
  it("un Error genérico se normaliza a 500 INTERNAL_ERROR", () => {
    const json = jest.fn();
    const res = {
      status: jest.fn().mockReturnThis(),
      json,
    } as unknown as import("express").Response;
    const req = {
      method: "GET",
      originalUrl: "/boom",
    } as unknown as import("express").Request;

    errorHandler(new Error("kaboom"), req, res, jest.fn());

    expect((res.status as jest.Mock).mock.calls[0][0]).toBe(500);
    expect(json).toHaveBeenCalledWith({
      error: { code: "INTERNAL_ERROR", message: "kaboom" },
    });
  });

  it("un AppError conserva su code y status", () => {
    const json = jest.fn();
    const res = {
      status: jest.fn().mockReturnThis(),
      json,
    } as unknown as import("express").Response;
    const req = {
      method: "POST",
      originalUrl: "/x",
    } as unknown as import("express").Request;

    errorHandler(AppError.notFound("NOPE", "missing"), req, res, jest.fn());

    expect((res.status as jest.Mock).mock.calls[0][0]).toBe(404);
    expect(json).toHaveBeenCalledWith({
      error: { code: "NOPE", message: "missing" },
    });
  });
});
