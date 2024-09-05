import { AxiosRequestConfig } from "axios";
import { ServiceAccess, WorkspaceAccess } from "./service-access.type";
import { getJWT } from "./get-jwt";

function isValidServiceAccess(access: unknown): access is ServiceAccess {
  return typeof access === "object" && !!access && "type" in access;
}

function isWorkspaceAccess(access: ServiceAccess): access is WorkspaceAccess {
  return "type" in access && access.type === "workspace";
}

export async function attachAuthorizationHeader(
  axiosRequestConfig: AxiosRequestConfig
): Promise<AxiosRequestConfig> {
  const access = (axiosRequestConfig as { access: unknown }).access;
  if (
    !axiosRequestConfig.headers?.Authorization &&
    isValidServiceAccess(access)
  ) {
    const jwt = await getJWT(
      isWorkspaceAccess(access)
        ? `workspaceId=${access.workspaceId}`
        : undefined
    );
    if (!axiosRequestConfig.headers) {
      axiosRequestConfig.headers = {};
    }
    axiosRequestConfig.headers["Authorization"] = `Bearer ${jwt}`;
  }
  return axiosRequestConfig;
}
