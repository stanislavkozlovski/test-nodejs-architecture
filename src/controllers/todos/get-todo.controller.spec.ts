import request from "supertest";
import { v4 as uuid } from "uuid";
import { server } from "../../test.functions";
import { getTodoController } from "./get-todo.controller";
import { createStubTodo } from "./todo.stub";

const workspaceId = uuid();

jest.mock("./todo.dao");
jest.mock("../../jwt-token", () => ({
  getToken: () => ({
    workspaceId,
  }),
}));

describe("getTodoController", () => {
  const route = "/todos/:id";

  const app = server((app) => {
    app.get(route, getTodoController);
  });

  it("returns the todo with the id", async () => {
    const getTodo = require("./todo.dao").getTodo;
    const todo = createStubTodo();
    getTodo.mockResolvedValue(todo);
    const response = await request(app)
      .get(route.replace(":id", todo.id))
      .expect(200);
    expect(response).toHaveProperty("body", todo);
    expect(getTodo).toHaveBeenCalledWith(workspaceId, todo.id);
  });

  it("returns a 404 if no todo with that id exists", async () => {
    const getTodo = require("./todo.dao").getTodo;
    const todoId = uuid();
    getTodo.mockResolvedValue(undefined);
    await request(app).get(route.replace(":id", todoId)).expect(404);
    expect(getTodo).toHaveBeenCalledWith(workspaceId, todoId);
  });

  it("rejects an invalid ID", async () => {
    const getTodo = require("./todo.dao").getTodo;
    const todoId = "123";
    getTodo.mockResolvedValue();
    const response = await request(app)
      .get(route.replace(":id", todoId))
      .expect(400);
    expect(response).toHaveProperty(
      "body.message",
      'request.params.id should match format "uuid"'
    );
    expect(getTodo).not.toHaveBeenCalled();
  });
});
