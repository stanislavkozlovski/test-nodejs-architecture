import { logger } from "../logger";
import { getDelayedTodos } from "./delayed-todo.dao";
import { sendDelayNotification } from "./send-delay-notification";

export async function sendDelayNotifications(
  startDate: string
): Promise<boolean> {
  logger.info({ startDate }, "Starting to send delay notifications.");
  const todos = await getDelayedTodos(startDate).catch((error) => {
    logger.error(
      { startDate, error },
      "Could not retrieve delayed todos from the database. Aborting job..."
    );
    return null;
  });
  if (!todos) {
    return false;
  }
  for (const todo of todos) {
    await sendDelayNotification(todo);
  }
  logger.info({ startDate }, "Finished to send delay notifications.");
  return true;
}
