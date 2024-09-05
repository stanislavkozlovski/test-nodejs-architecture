import { db } from "../database/db";
import { DbTodo } from "./todo.type";

export function getDelayedTodos(
  now: string
): Promise<Pick<DbTodo, "id" | "workspaceId">[]> {
  return db
    .table<DbTodo>("todos")
    .where("dueDate", "<=", now)
    .select("id", "workspaceId");
}
