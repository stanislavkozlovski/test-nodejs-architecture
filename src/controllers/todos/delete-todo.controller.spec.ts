import request from "supertest";
import { v4 as uuid } from "uuid";
import { server } from "../../test.functions";
import { deleteTodoController } from "./delete-todo.controller";

const workspaceId = uuid();

jest.mock("./todo.dao");
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

  it("deletes the todo and returns a 204", async () => {
    const deleteTodo = require("./todo.dao").deleteTodo;
    const todoId = uuid();
    deleteTodo.mockResolvedValue();
    await request(app).delete(route.replace(":id", todoId)).expect(204);
    expect(deleteTodo).toHaveBeenCalledWith(workspaceId, todoId);
  });

  it("rejects an invalid ID", async () => {
    const deleteTodo = require("./todo.dao").deleteTodo;
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
  });
});
