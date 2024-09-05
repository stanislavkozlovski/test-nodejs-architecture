import { NextFunction, Request, Response } from "express";
import { getToken } from "../../jwt-token";
import { updateTodo } from "./todo.dao";

export async function putTodoController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = getToken(response).workspaceId;
    const updatedTodo = await updateTodo(
      workspaceId,
      request.params.id,
      request.body
    );
    if (updatedTodo === "NotFound") {
      response.sendStatus(404);
    } else {
      response.send(updatedTodo);
    }
  } catch (error) {
    next(error);
  }
}
