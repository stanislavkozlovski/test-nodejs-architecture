import { WorkspaceId } from "../workspace-id.type";

export type ServiceAccess = AdminAccess | WorkspaceAccess;

export interface AdminAccess {
  type: "admin";
}

export type WorkspaceAccess = {
  type: "workspace";
  workspaceId: WorkspaceId;
};

export function workspaceAccess(workspaceId: WorkspaceId): WorkspaceAccess {
  return {
    type: "workspace",
    workspaceId,
  };
}

export const adminAccess: AdminAccess = {
  type: "admin",
};
