import request from "supertest";
import { v4 as uuid } from "uuid";
import { server } from "../../test.functions";
import { deleteTodoController } from "./delete-todo.controller";

const workspaceId = uuid();

jest.mock("./todo.dao");
jest.mock("./notification.service");
jest.mock("../../jwt-token", () => ({
  getToken: () => ({
    workspaceId,
  }),
}));

describe("deleteTodoController", () => {
  const route = "/todos/:id";

  const app = server((app) => {
    app.delete(route, deleteTodoController);
  });

  it("deletes the todo, sends a notification and returns a 204", async () => {
    const deleteTodo = require("./todo.dao").deleteTodo;
    const sendNotification = require("./notification.service").sendNotification;
    const todoId = uuid();
    deleteTodo.mockResolvedValue();
    await request(app).delete(route.replace(":id", todoId)).expect(204);
    expect(deleteTodo).toHaveBeenCalledWith(workspaceId, todoId);
    expect(sendNotification).toHaveBeenCalledWith(`Deleted todo ${todoId}`);
  });

  it("rejects an invalid ID", async () => {
    const deleteTodo = require("./todo.dao").deleteTodo;
    const sendNotification = require("./notification.service").sendNotification;
    const todoId = "123";
    deleteTodo.mockResolvedValue();
    const response = await request(app)
      .delete(route.replace(":id", todoId))
      .expect(400);
    expect(response).toHaveProperty(
      "body.message",
      'request.params.id should match format "uuid"'
    );
    expect(deleteTodo).not.toHaveBeenCalled();
    expect(sendNotification).not.toHaveBeenCalled();
  });
});
