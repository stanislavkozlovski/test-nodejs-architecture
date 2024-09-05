import { logger } from "../logger";
import { setDelayNotificationSent } from "./delayed-todo.dao";
import { sendNotification } from "./notification.service";
import { DbTodo } from "./todo.type";

export async function sendDelayNotification(
  todo: Pick<DbTodo, "id" | "workspaceId">
): Promise<boolean> {
  try {
    await sendNotification(todo.workspaceId, `Todo ${todo.id} is delayed`);
    try {
      await setDelayNotificationSent(todo.workspaceId, todo.id);
      return true;
    } catch (error) {
      logger.error(
        {
          workspaceId: todo.workspaceId,
          todoId: todo.id,
          error,
        },
        "Could not mark in the database that the notification for this todo has been sent. The notification will be send another time in the next run."
      );
      return false;
    }
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
