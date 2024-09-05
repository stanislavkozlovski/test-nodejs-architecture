import { NextFunction, Request, Response } from "express";
import { getToken } from "../../jwt-token";
import { sendNotification } from "./notification.service";
import { deleteTodo } from "./todo.dao";

export async function deleteTodoController(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = getToken(response).workspaceId;
    await deleteTodo(workspaceId, request.params.id);
    await sendNotification(`Deleted todo ${request.params.id}`);
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
