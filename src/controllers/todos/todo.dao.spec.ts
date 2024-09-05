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

  it("retrieves no todos if there are none in this workspace", async () => {
    const workspaceId = uuid();
    await expect(getTodos(workspaceId)).resolves.toEqual([]);
  });

  it("inserts a todo and retrieves it", async () => {
    const workspaceId = uuid();
    const todo = omit("id", createStubTodo());
    const createdTodo = await createTodo(workspaceId, todo);
    expect(createdTodo).toHaveProperty("id");
    await expect(getTodos(workspaceId)).resolves.toEqual([createdTodo]);
    await expect(getTodo(workspaceId, createdTodo.id)).resolves.toEqual(
      createdTodo
    );
  });

  it("does not retrieve a todo of a different workspace", async () => {
    const workspaceId1 = uuid();
    const workspaceId2 = uuid();
    const todo = omit("id", createStubTodo());
    const createdTodo = await createTodo(workspaceId1, todo);
    await expect(getTodos(workspaceId2)).resolves.toEqual([]);
    await expect(getTodo(workspaceId2, createdTodo.id)).resolves.toEqual(
      undefined
    );
  });

  it("updates an existing todo", async () => {
    const workspaceId = uuid();
    const toBeCreatedTodo = omit("id", createStubTodo());
    const createdTodo = await createTodo(workspaceId, toBeCreatedTodo);
    const toBeUpdatedTodo = omit("id", createStubTodo());
    const updatedTodo = await updateTodo(
      workspaceId,
      createdTodo.id,
      toBeUpdatedTodo
    );
    await expect(getTodos(workspaceId)).resolves.toEqual([updatedTodo]);
    await expect(getTodo(workspaceId, createdTodo.id)).resolves.toEqual(
      updatedTodo
    );
  });

  it("does not update a todo of a different workspace", async () => {
    const workspaceId1 = uuid();
    const workspaceId2 = uuid();
    const toBeCreatedTodo = omit("id", createStubTodo());
    const createdTodo = await createTodo(workspaceId1, toBeCreatedTodo);
    const toBeUpdatedTodo = omit("id", createStubTodo());
    const updatedTodo = await updateTodo(
      workspaceId2,
      createdTodo.id,
      toBeUpdatedTodo
    );
    expect(updatedTodo).toEqual("NotFound");
    await expect(getTodos(workspaceId1)).resolves.toEqual([
      { ...toBeCreatedTodo, id: createdTodo.id },
    ]);
    await expect(getTodos(workspaceId2)).resolves.toEqual([]);
    await expect(getTodo(workspaceId1, createdTodo.id)).resolves.toEqual({
      ...toBeCreatedTodo,
      id: createdTodo.id,
    });
    await expect(getTodo(workspaceId2, createdTodo.id)).resolves.toEqual(
      undefined
    );
  });

  it("deletes an existing todo", async () => {
    const workspaceId = uuid();
    const toBeCreatedTodo = omit("id", createStubTodo());
    const createdTodo = await createTodo(workspaceId, toBeCreatedTodo);
    await expect(deleteTodo(workspaceId, createdTodo.id)).resolves.toEqual(
      "Ok"
    );
    await expect(getTodos(workspaceId)).resolves.toEqual([]);
    await expect(getTodo(workspaceId, createdTodo.id)).resolves.toEqual(
      undefined
    );
  });

  it("does not delete a todo of a different workspace", async () => {
    const workspaceId1 = uuid();
    const workspaceId2 = uuid();
    const toBeCreatedTodo = omit("id", createStubTodo());
    const createdTodo = await createTodo(workspaceId1, toBeCreatedTodo);
    await expect(deleteTodo(workspaceId2, createdTodo.id)).resolves.toEqual(
      "NotFound"
    );
    await expect(getTodos(workspaceId1)).resolves.toHaveLength(1);
    await expect(getTodos(workspaceId2)).resolves.toHaveLength(0);
    await expect(getTodo(workspaceId1, createdTodo.id)).resolves.not.toEqual(
      undefined
    );
    await expect(getTodo(workspaceId2, createdTodo.id)).resolves.toEqual(
      undefined
    );
  });

  it("does not find a non-existing todo on update", async () => {
    const workspaceId = uuid();
    const todo = omit("id", createStubTodo());
    await expect(updateTodo(workspaceId, uuid(), todo)).resolves.toEqual(
      "NotFound"
    );
  });

  it("does not find a non-existing todo on delete", async () => {
    const workspaceId = uuid();
    await expect(deleteTodo(workspaceId, uuid())).resolves.toEqual("NotFound");
  });
});
