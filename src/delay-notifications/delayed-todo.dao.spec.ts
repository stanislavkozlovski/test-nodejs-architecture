import { db } from "../database/db";
import { migrateDatabase, truncateTables } from "../database/db-test.functions";
import { getDelayedTodos } from "./delayed-todo.dao";
import { v4 as uuid } from "uuid";
import { createStubTodo } from "./todo.stub";

describe("the delayed todo dao", () => {
  beforeAll(migrateDatabase);
  afterEach(truncateTables);

  it("retrieves no todos if there are none in any workspace", async () => {
    await expect(getDelayedTodos("2022-01-01")).resolves.toEqual([]);
  });

  it("retrieves a delayed todo", async () => {
    const todo = createStubTodo(uuid(), "2021-01-01");
    await db.table("todos").insert(todo);
    await expect(getDelayedTodos("2022-01-01")).resolves.toEqual([
      { id: todo.id, workspaceId: todo.workspaceId },
    ]);
  });

  it("does not retrieve an on-time todo", async () => {
    const todo = createStubTodo(uuid(), "2023-01-01");
    await db.table("todos").insert(todo);
    await expect(getDelayedTodos("2022-01-01")).resolves.toEqual([]);
  });

  it("retrieves two delayed todos from different workspaces", async () => {
    const todo1 = createStubTodo(uuid(), "2021-01-01");
    const todo2 = createStubTodo(uuid(), "2021-01-01");
    await db.table("todos").insert([todo1, todo2]);
    await expect(getDelayedTodos("2022-01-01")).resolves.toEqual([
      { id: todo1.id, workspaceId: todo1.workspaceId },
      { id: todo2.id, workspaceId: todo2.workspaceId },
    ]);
  });
});
