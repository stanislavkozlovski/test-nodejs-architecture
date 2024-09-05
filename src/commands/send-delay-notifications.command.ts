import { configureHttp } from "../http/configure-http";
import { sendDelayNotifications } from "../delay-notifications/send-delay-notifications";

export async function cmdSendDelayNotifications(): Promise<void> {
  configureHttp();
  const now = new Date().toISOString().split("T")[0];
  await sendDelayNotifications(now);
  process.exit(0);
}
