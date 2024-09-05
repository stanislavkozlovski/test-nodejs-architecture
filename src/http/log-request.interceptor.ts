import { AxiosRequestConfig } from "axios";
import { logger } from "../logger";

export function logRequest(request: AxiosRequestConfig): AxiosRequestConfig {
  logger.debug(
    {
      method: request.method?.toUpperCase(),
      url: request.url,
      body: request.data,
    },
    "Request"
  );
  return request;
}
