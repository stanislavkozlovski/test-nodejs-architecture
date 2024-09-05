import { logger } from "../logger";
import { getDelayedTodos } from "./delayed-todo.dao";
import { sendDelayNotification } from "./send-delay-notification";
import { DbTodo } from "./todo.type";

export async function sendDelayNotifications(
  startDate: string,
  pageSize: number
): Promise<boolean> {
  logger.info({ startDate }, "Starting to send delay notifications.");
  let offset = 0;
  let todos: Pick<DbTodo, "workspaceId" | "id">[] | null = null;
  do {
    todos = await getDelayedTodos(startDate, offset, pageSize).catch(
      (error) => {
        logger.error(
          { startDate, error },
          "Could not retrieve delayed todos from the database. Aborting job..."
        );
        return null;
      }
    );
    if (!todos) {
      return false;
    }
    for (const todo of todos) {
      await sendDelayNotification(todo);
    }
    offset += pageSize;
  } while (todos.length === pageSize);
  logger.info({ startDate }, "Finished to send delay notifications.");
  return true;
}
