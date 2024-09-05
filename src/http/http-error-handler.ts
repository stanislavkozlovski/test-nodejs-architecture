import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";

function isAxiosError<T>(error: Error | AxiosError<T>): error is AxiosError<T> {
  return "isAxiosError" in error && error.isAxiosError;
}

export function handleHttpError(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (isAxiosError(error)) {
    request.log.error(
      {
        method: error.config.method?.toUpperCase(),
        url: error.config.url,
        headers: error.config.headers,
        params: error.config.params,
        message: error.message,
        response: {
          status: error.response?.status,
          data: error.response?.data,
        },
        stack: error.stack,
      },
      "Error Response"
    );
    response.status(500).json({
      message: `Failed request`,
      method: error.config.method?.toUpperCase(),
      url: error.config.url,
    });
  } else {
    next(error);
  }
}
