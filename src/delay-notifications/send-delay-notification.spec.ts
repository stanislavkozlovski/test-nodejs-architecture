import { sendDelayNotification } from "./send-delay-notification";
import { v4 as uuid } from "uuid";

jest.mock("../logger");
jest.mock("./delayed-todo.dao");
jest.mock("./notification.service");

describe("sending a delay notification", () => {
  it("sends a notification", async () => {
    const logger = require("../logger").logger;
    const sendNotification = require("./notification.service").sendNotification;
    const todo = {
      id: uuid(),
      workspaceId: uuid(),
    };
    await expect(sendDelayNotification(todo)).resolves.toEqual(true);
    expect(sendNotification).toHaveBeenCalledWith(
      todo.workspaceId,
      `Todo ${todo.id} is delayed`
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("logs an error if a notification can not be send", async () => {
    const logger = require("../logger").logger;
    const sendNotification = require("./notification.service").sendNotification;
    const todo = {
      id: uuid(),
      workspaceId: uuid(),
    };
    sendNotification.mockRejectedValue(new Error("Something happened"));
    await expect(sendDelayNotification(todo)).resolves.toEqual(false);
    expect(sendNotification).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      {
        todoId: todo.id,
        workspaceId: todo.workspaceId,
        error: new Error("Something happened"),
      },
      "Could not send delayed todo. Skipping it..."
    );
  });
});
