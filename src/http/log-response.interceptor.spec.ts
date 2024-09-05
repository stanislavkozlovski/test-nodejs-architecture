import { AxiosResponse } from "axios";
import { logResponse } from "./log-response.interceptor";

jest.mock("../logger");

describe("logging responses", () => {
  it("should log a concise info and more debug info", () => {
    const logger = require("../logger").logger;
    logResponse({
      status: 200,
      data: {
        some: "response",
      },
      config: {
        data: {
          some: "request",
        },
        method: "get",
        url: "https://some.org/api",
      },
    } as AxiosResponse);
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(
      {
        status: 200,
        method: "GET",
        url: "https://some.org/api",
      },
      "Response"
    );
    expect(logger.debug).toHaveBeenCalledWith(
      {
        status: 200,
        method: "GET",
        url: "https://some.org/api",
        body: {
          some: "response",
        },
      },
      "Response Details"
    );
  });
});
