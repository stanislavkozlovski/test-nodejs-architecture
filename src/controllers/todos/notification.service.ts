import axios, { AxiosRequestConfig } from "axios";
import { config } from "../../configuration/config";
import { workspaceAccess } from "../../http/service-access.type";
import { WorkspaceId } from "../../workspace-id.type";

export function sendNotification(
  workspaceId: WorkspaceId,
  message: string
): Promise<void> {
  return axios.post(
    `${config.http.servicesUrl}/notify/notifications`,
    { message },
    {
      access: workspaceAccess(workspaceId),
    } as AxiosRequestConfig
  );
}
