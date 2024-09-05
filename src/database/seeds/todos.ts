import { Knex } from "knex";
import { DbTodo } from "../../controllers/todos/todo.type";
import { WorkspaceId } from "../../workspace-id.type";

const workspaceId1: WorkspaceId = "a9393008-eab2-48e8-b820-0e03447f881c";
const workspaceId2: WorkspaceId = "83fdfa88-737d-4550-87e4-c78bf954fcf2";

const todos: DbTodo[] = [
  {
    workspaceId: workspaceId1,
    id: "142e8446-f5ba-4813-bfb5-f3192a37f1bf",
    name: "Workspace 1 - Todo 1",
    assignee: "Naomi",
    dueDate: "2025-01-05",
  },
  {
    workspaceId: workspaceId1,
    id: "bf6091cc-69f8-4a9e-93ed-0294c3a8ac2f",
    name: "Workspace 1 - Todo 2",
    assignee: "Peter",
    dueDate: "2020-06-11",
  },
  {
    workspaceId: workspaceId1,
    id: "6e5bad4c-7f1c-4ab4-9361-c6bd697b4257",
    name: "Workspace 1 - Todo 3",
    assignee: "Sheila",
    dueDate: "2032-11-27",
  },
  {
    workspaceId: workspaceId2,
    id: "1d2be9f2-4fe9-4509-b8ec-d0d9425c3685",
    name: "Workspace 2 - Todo 1",
    assignee: "Ousmane",
    dueDate: "2020-07-14",
  },
  {
    workspaceId: workspaceId2,
    id: "e868f10d-d21a-4139-9c5d-b8c73c62735a",
    name: "Workspace 2 - Todo 2",
    assignee: "Carla",
    dueDate: "2034-09-07",
  },
];

export async function seed(knex: Knex): Promise<void> {
  await knex("todos").truncate();
  await knex("todos").insert(todos);
}
