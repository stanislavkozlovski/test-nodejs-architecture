import { logger } from "./logger";
import { cmdServer } from "./commands/server.command";
import { cmdSendDelayNotifications } from "./commands/send-delay-notifications.command";

async function main([_node, _script, command = "server"]: string[]) {
  switch (command) {
    case "server":
      await cmdServer();
      break;
    case "send-delay-notifications":
      await cmdSendDelayNotifications();
      break;
    default:
      logger.error({ command }, "Command does not exist");
      process.exit(1);
  }
}

main(process.argv).catch((error) => {
  logger.error(error, `Uncaught error: ${error.message}`);
  process.exit(1);
});

process
  .on("unhandledRejection", (reason) => {
    logger.error(
      reason ?? {},
      `Unhandled rejection: ${(reason as Error)?.message}`
    );
  })
  .on("uncaughtException", (error) => {
    logger.error(error, `Uncaught Exception: ${error?.message}`);
    process.exit(1);
  });
