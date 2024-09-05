import { v4 as uuid } from "uuid";
import { WorkspaceId } from "../workspace-id.type";

export const createStubTodo = (workspaceId: WorkspaceId, dueDate: string) => ({
  id: uuid(),
  workspaceId,
  name: "Name",
  assignee: "Assignee",
  dueDate,
});
