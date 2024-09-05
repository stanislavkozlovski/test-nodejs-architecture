import { logger } from "../logger";

export async function sendDelayNotifications(
  startDate: string
): Promise<boolean> {
  logger.info({ startDate }, "Starting to send delay notifications.");
  // ...
  logger.info({ startDate }, "Finished to send delay notifications.");
  return true;
}
