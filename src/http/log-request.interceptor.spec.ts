import { AxiosRequestConfig } from "axios";
import { logRequest } from "./log-request.interceptor";

jest.mock("../logger");

describe("logging requests", () => {
  it("should log a concise message and the full body in debug mode", () => {
    const logger = require("../logger").logger;
    logRequest({
      data: {
        some: "body",
      },
      method: "get",
      url: "https://some.org/api",
    } as AxiosRequestConfig);
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith(
      {
        method: "GET",
        url: "https://some.org/api",
        body: { some: "body" },
      },
      "Request"
    );
  });
});
