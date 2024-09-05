import { logger } from "../logger";
import { sendNotification } from "./notification.service";
import { DbTodo } from "./todo.type";

export async function sendDelayNotification(
  todo: Pick<DbTodo, "id" | "workspaceId">
): Promise<boolean> {
  try {
    await sendNotification(todo.workspaceId, `Todo ${todo.id} is delayed`);
    return true;
  } catch (error) {
    logger.error(
      {
        workspaceId: todo.workspaceId,
        todoId: todo.id,
        error,
      },
      "Could not send delayed todo. Skipping it..."
    );
    return false;
  }
}
