import { db } from "../database/db";
import { WorkspaceId } from "../workspace-id.type";
import { DbTodo, TodoId } from "./todo.type";

export function getDelayedTodos(
  now: string
): Promise<Pick<DbTodo, "id" | "workspaceId">[]> {
  return db
    .table<DbTodo>("todos")
    .where("dueDate", "<=", now)
    .andWhere("delayNotificationSent", false)
    .select("id", "workspaceId");
}

export async function setDelayNotificationSent(
  workspaceId: WorkspaceId,
  todoId: TodoId
): Promise<void> {
  await db
    .table<DbTodo>("todos")
    .where("id", todoId)
    .andWhere("workspaceId", workspaceId)
    .update("delayNotificationSent", true);
}
