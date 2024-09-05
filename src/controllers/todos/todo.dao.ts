import { v4 as uuid } from "uuid";
import { db } from "../../database/db";
import { WorkspaceId } from "../../workspace-id.type";
import { DbTodo, Todo, todoFields, TodoId } from "./todo.type";

export function getTodo(
  workspaceId: WorkspaceId,
  id: TodoId
): Promise<Todo | undefined> {
  return db
    .table<DbTodo>("todos")
    .where("id", id)
    .andWhere("workspaceId", workspaceId)
    .first<Todo>(todoFields);
}

export function getTodos(workspaceId: WorkspaceId): Promise<Todo[]> {
  return db
    .table<DbTodo>("todos")
    .where("workspaceId", workspaceId)
    .select(todoFields);
}

export async function createTodo(
  workspaceId: WorkspaceId,
  todo: Omit<Todo, "id">
): Promise<Todo> {
  const todoWithId: Todo = {
    ...todo,
    id: uuid(),
  };
  await db.table<DbTodo>("todos").insert({
    ...todoWithId,
    workspaceId,
  });
  return todoWithId;
}

export async function updateTodo(
  workspaceId: WorkspaceId,
  id: TodoId,
  todo: Omit<Todo, "id">
): Promise<Todo | "NotFound"> {
  const todoWithId = {
    ...todo,
    id,
  };
  const changedRowCount = await db
    .table<DbTodo>("todos")
    .where("id", id)
    .andWhere("workspaceId", workspaceId)
    .update({
      ...todoWithId,
      workspaceId,
    });
  return changedRowCount === 0 ? "NotFound" : todoWithId;
}

export async function deleteTodo(
  workspaceId: WorkspaceId,
  id: TodoId
): Promise<"Ok" | "NotFound"> {
  const deletedRowCount = await db
    .table<DbTodo>("todos")
    .where("id", id)
    .andWhere("workspaceId", workspaceId)
    .delete();
  return deletedRowCount === 0 ? "NotFound" : "Ok";
}
