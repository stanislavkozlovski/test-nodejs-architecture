import * as http from "http";
import app from "../app";
import { logger } from "../logger";
import { configureHttp } from "../http/configure-http";

export async function cmdServer(): Promise<void> {
  const port = process.env.PORT ?? 3000;
  configureHttp();
  const server = http.createServer(app);
  server.listen(port, () => {
    logger.info(`Server listening on port ${port}!`);
  });
}
