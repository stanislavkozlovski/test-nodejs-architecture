import { NextFunction, Request, Response } from "express";
import { getToken } from "../../jwt-token";
import { getTodos } from "./todo.dao";

export async function getTodosController(
  _request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = getToken(response).workspaceId;
    const todos = await getTodos(workspaceId);
    response.send(todos);
  } catch (error) {
    next(error);
  }
}
