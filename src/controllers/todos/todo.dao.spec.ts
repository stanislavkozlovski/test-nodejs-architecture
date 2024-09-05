import { omit } from "lodash/fp";
import {
  migrateDatabase,
  truncateTables,
} from "../../database/db-test.functions";
import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo,
} from "./todo.dao";
import { createStubTodo } from "./todo.stub";
import { v4 as uuid } from "uuid";

describe("the todo dao", () => {
  beforeAll(migrateDatabase);
  afterEach(truncateTables);

  it("retrieves no todos if the database is empty", async () => {
    await expect(getTodos()).resolves.toEqual([]);
  });

  it("inserts a todo and retrieves it", async () => {
    const todo = omit("id", createStubTodo());
    const createdTodo = await createTodo(todo);
    expect(createdTodo).toHaveProperty("id");
    await expect(getTodos()).resolves.toEqual([createdTodo]);
    await expect(getTodo(createdTodo.id)).resolves.toEqual(createdTodo);
  });

  it("updates an existing todo", async () => {
    const toBeCreatedTodo = omit("id", createStubTodo());
    const createdTodo = await createTodo(toBeCreatedTodo);
    const toBeUpdatedTodo = omit("id", createStubTodo());
    const updatedTodo = await updateTodo(createdTodo.id, toBeUpdatedTodo);
    await expect(getTodos()).resolves.toEqual([updatedTodo]);
    await expect(getTodo(createdTodo.id)).resolves.toEqual(updatedTodo);
  });

  it("deletes an existing todo", async () => {
    const toBeCreatedTodo = omit("id", createStubTodo());
    const createdTodo = await createTodo(toBeCreatedTodo);
    await expect(deleteTodo(createdTodo.id)).resolves.toEqual("Ok");
    await expect(getTodos()).resolves.toEqual([]);
    await expect(getTodo(createdTodo.id)).resolves.toEqual(undefined);
  });

  it("does not find a non-existing todo on update", async () => {
    const todo = omit("id", createStubTodo());
    await expect(updateTodo(uuid(), todo)).resolves.toEqual("NotFound");
  });

  it("does not find a non-existing todo on delete", async () => {
    await expect(deleteTodo(uuid())).resolves.toEqual("NotFound");
  });
});
