import { AxiosError } from "axios";
import { mockControllerInputs } from "../test.functions";
import { handleHttpError } from "./http-error-handler";

describe("the HTTP error handler", () => {
  it("should log the HTTP error and send a 500", () => {
    const { request, response, next } = mockControllerInputs({
      headers: {},
    });
    const error = new AxiosError(
      "message",
      "code",
      {
        method: "get",
        url: "https://some.url/",
        headers: {
          a: "b",
        },
        params: {
          c: "d",
        },
      },
      {},
      {
        status: 200,
        statusText: "statusText",
        data: {},
        headers: {},
        config: {},
      }
    );
    handleHttpError(error, request, response, next);
    expect(request.log.error).toHaveBeenCalledWith(
      {
        method: "GET",
        url: "https://some.url/",
        headers: {
          a: "b",
        },
        params: {
          c: "d",
        },
        message: "message",
        response: {
          status: 200,
          data: {},
        },
        stack: error.stack,
      },
      "Error Response"
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should skip different errors", () => {
    const { request, response, next } = mockControllerInputs({
      headers: {},
    });
    const error = new Error("No HTTP error");
    handleHttpError(error, request, response, next);
    expect(request.log.error).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
