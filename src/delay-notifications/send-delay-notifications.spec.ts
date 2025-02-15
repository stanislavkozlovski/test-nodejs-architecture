import { sendDelayNotifications } from "./send-delay-notifications";
import { createStubTodo } from "./todo.stub";
import { v4 as uuid } from "uuid";

jest.mock("../logger");
jest.mock("./delayed-todo.dao");
jest.mock("./send-delay-notification");

describe("sending delay notifications", () => {
  it("does not send notifications if there are no delayed todos", async () => {
    const getDelayedTodos = require("./delayed-todo.dao").getDelayedTodos;
    const sendDelayNotification =
      require("./send-delay-notification").sendDelayNotification;
    getDelayedTodos.mockResolvedValueOnce([]);
    await expect(sendDelayNotifications("2022-01-01", 1)).resolves.toEqual(
      true
    );
    expect(getDelayedTodos).toHaveBeenCalledWith("2022-01-01", 0, 1);
    expect(sendDelayNotification).not.toHaveBeenCalled();
  });

  it("sends a notification for a delayed todo", async () => {
    const getDelayedTodos = require("./delayed-todo.dao").getDelayedTodos;
    const sendDelayNotification =
      require("./send-delay-notification").sendDelayNotification;
    const todo = createStubTodo(uuid(), "2021-01-01");
    getDelayedTodos.mockResolvedValueOnce([todo]).mockResolvedValueOnce([]);
    await expect(sendDelayNotifications("2022-01-01", 1)).resolves.toEqual(
      true
    );
    expect(sendDelayNotification).toHaveBeenCalledTimes(1);
    expect(sendDelayNotification).toHaveBeenCalledWith(todo);
  });

  it("sends notifications for multiple pages of delayed todos", async () => {
    const getDelayedTodos = require("./delayed-todo.dao").getDelayedTodos;
    const sendDelayNotification =
      require("./send-delay-notification").sendDelayNotification;
    const todo1 = createStubTodo(uuid(), "2021-01-01");
    const todo2 = createStubTodo(uuid(), "2021-01-01");
    getDelayedTodos
      .mockResolvedValueOnce([todo1])
      .mockResolvedValueOnce([todo2])
      .mockResolvedValueOnce([]);
    await expect(sendDelayNotifications("2022-01-01", 1)).resolves.toEqual(
      true
    );
    expect(sendDelayNotification).toHaveBeenCalledTimes(2);
    expect(sendDelayNotification).toHaveBeenNthCalledWith(1, todo1);
    expect(sendDelayNotification).toHaveBeenNthCalledWith(2, todo2);
  });

  it("logs an error if the delayed todos can not be retrieved", async () => {
    const logger = require("../logger").logger;
    const getDelayedTodos = require("./delayed-todo.dao").getDelayedTodos;
    const sendDelayNotification =
      require("./send-delay-notification").sendDelayNotification;
    getDelayedTodos.mockRejectedValue(new Error("Something happened"));
    await expect(sendDelayNotifications("2022-01-01", 1)).resolves.toEqual(
      false
    );
    expect(sendDelayNotification).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      {
        startDate: "2022-01-01",
        error: new Error("Something happened"),
      },
      "Could not retrieve delayed todos from the database. Aborting job..."
    );
  });
});
