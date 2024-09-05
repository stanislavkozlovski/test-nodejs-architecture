import { db } from "../database/db";
import { migrateDatabase, truncateTables } from "../database/db-test.functions";
import { getDelayedTodos, setDelayNotificationSent } from "./delayed-todo.dao";
import { v4 as uuid } from "uuid";
import { createStubTodo } from "./todo.stub";

describe("the delayed todo dao", () => {
  beforeAll(migrateDatabase);
  afterEach(truncateTables);

  it("retrieves no todos if there are none in any workspace", async () => {
    await expect(getDelayedTodos("2022-01-01", 0, 100)).resolves.toEqual([]);
  });

  it("retrieves no todos if there are none on the page", async () => {
    const todo = createStubTodo(uuid(), "2021-01-01");
    await db.table("todos").insert(todo);
    await expect(getDelayedTodos("2022-01-01", 1, 100)).resolves.toEqual([]);
  });

  it("retrieves no more than the limited number of todos on one page", async () => {
    const todo1 = createStubTodo(uuid(), "2021-01-01");
    const todo2 = createStubTodo(uuid(), "2021-01-01");
    await db.table("todos").insert([todo1, todo2]);
    await expect(getDelayedTodos("2022-01-01", 0, 1)).resolves.toHaveLength(1);
  });

  it("retrieves all todos exactly once in the correct order", async () => {
    const todo1 = createStubTodo(
      uuid(),
      "2021-01-01",
      false,
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    );
    const todo2 = createStubTodo(
      uuid(),
      "2021-01-01",
      false,
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    );
    const todo3 = createStubTodo(
      uuid(),
      "2021-01-01",
      false,
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
    );
    const todo4 = createStubTodo(
      uuid(),
      "2021-01-01",
      false,
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
    );
    await db.table("todos").insert([todo2, todo4, todo1, todo3]);
    await expect(getDelayedTodos("2022-01-01", 0, 1)).resolves.toEqual([
      { id: todo1.id, workspaceId: todo1.workspaceId },
    ]);
  });

  it("retrieves a delayed todo", async () => {
    const todo = createStubTodo(uuid(), "2021-01-01");
    await db.table("todos").insert(todo);
    await expect(getDelayedTodos("2022-01-01", 0, 100)).resolves.toEqual([
      { id: todo.id, workspaceId: todo.workspaceId },
    ]);
  });

  it("does not retrieve an on-time todo", async () => {
    const todo = createStubTodo(uuid(), "2023-01-01");
    await db.table("todos").insert(todo);
    await expect(getDelayedTodos("2022-01-01", 0, 100)).resolves.toEqual([]);
  });

  it("does not retrieve a todo which delay notification was already sent", async () => {
    const todo = createStubTodo(uuid(), "2021-01-01", true);
    await db.table("todos").insert(todo);
    await expect(getDelayedTodos("2022-01-01", 0, 100)).resolves.toEqual([]);
  });

  it("retrieves two delayed todos from different workspaces", async () => {
    const todo1 = createStubTodo(
      uuid(),
      "2021-01-01",
      false,
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    );
    const todo2 = createStubTodo(
      uuid(),
      "2021-01-01",
      false,
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    );
    await db.table("todos").insert([todo1, todo2]);
    await expect(getDelayedTodos("2022-01-01", 0, 100)).resolves.toEqual([
      { id: todo1.id, workspaceId: todo1.workspaceId },
      { id: todo2.id, workspaceId: todo2.workspaceId },
    ]);
  });

  it("sets that a delay notification has been sent", async () => {
    const todo = createStubTodo(uuid(), "2021-01-01");
    await db.table("todos").insert(todo);
    await setDelayNotificationSent(todo.workspaceId, todo.id);
    await expect(
      db.table("todos").first("delayNotificationSent")
    ).resolves.toEqual({ delayNotificationSent: true });
  });
});
