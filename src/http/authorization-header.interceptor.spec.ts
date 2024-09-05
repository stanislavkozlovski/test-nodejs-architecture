/* eslint-disable @typescript-eslint/no-var-requires */

import { AxiosRequestConfig } from "axios";
import { attachAuthorizationHeader } from "./authorization-header.interceptor";
import { adminAccess, workspaceAccess } from "./service-access.type";

jest.mock("./get-jwt");

describe("the authorization header interceptor", () => {
  it("should attach an admin token if access type is admin", async () => {
    const getJWT = require("./get-jwt").getJWT;
    getJWT.mockResolvedValue("my_admin_token");
    const request = await attachAuthorizationHeader({
      access: adminAccess,
    } as AxiosRequestConfig);
    expect(getJWT).toHaveBeenCalledWith(undefined);
    expect(request.headers).toHaveProperty(
      "Authorization",
      "Bearer my_admin_token"
    );
  });

  it("should attach a workspace token if target access is requested", async () => {
    const getJWT = require("./get-jwt").getJWT;
    getJWT.mockResolvedValue("my_token");
    const request = await attachAuthorizationHeader({
      access: workspaceAccess("1234"),
    } as AxiosRequestConfig);
    expect(getJWT).toHaveBeenCalledWith("workspaceId=1234");
    expect(request.headers).toHaveProperty("Authorization", "Bearer my_token");
  });

  it("should not attach a token if the access type is invalid", async () => {
    const getJWT = require("./get-jwt").getJWT;
    getJWT.mockResolvedValue("my_token");
    const request = await attachAuthorizationHeader({
      access: {},
    } as AxiosRequestConfig);
    expect(getJWT).not.toHaveBeenCalled();
    expect(request.headers).toEqual(undefined);
  });

  it("should fail if a JWT can not be retrieved", async () => {
    const getJWT = require("./get-jwt").getJWT;
    getJWT.mockRejectedValue("Failure");
    await expect(
      attachAuthorizationHeader({
        access: workspaceAccess("1234"),
      } as AxiosRequestConfig)
    ).rejects.toEqual("Failure");
  });
});
