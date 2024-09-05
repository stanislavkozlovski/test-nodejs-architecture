import { NextFunction, Request, Response } from "express";
import { getToken } from "../../jwt-token";
import { createTodo } from "./todo.dao";

export async function postTodoController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = getToken(response).workspaceId;
    const todo = await createTodo(workspaceId, request.body);
    response.send(todo);
  } catch (error) {
    next(error);
  }
}
