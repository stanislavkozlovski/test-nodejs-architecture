import { WithWorkspaceId } from "../workspace-id.type";

export type TodoId = string;

export interface Todo {
  id: TodoId;
  dueDate: string;
}

export type DbTodo = Todo & WithWorkspaceId;
