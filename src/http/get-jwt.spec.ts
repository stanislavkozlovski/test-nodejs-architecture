import { getJWT } from "./get-jwt";

jest.mock("../configuration/config", () => ({
  config: {
    http: {
      servicesUrl: "https://eu.company.org",
      clientId: "todos",
      clientSecret: "secret",
    },
  },
}));
jest.mock("axios");

describe("the retrieval of JWT", () => {
  it("should retrieve a JWT with admin access", async () => {
    const post = require("axios").post;
    post.mockResolvedValue({
      data: {
        access_token: "my_admin_token",
      },
    });
    await expect(getJWT()).resolves.toEqual("my_admin_token");
    expect(post).toHaveBeenCalledWith("https://eu.company.org/auth/token", "", {
      headers: {
        Authorization: "Basic dG9kb3M6c2VjcmV0",
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      params: {
        grant_type: "client_credentials",
      },
    });
  });

  it("should retrieve a JWT with workspace access", async () => {
    const post = require("axios").post;
    post.mockResolvedValue({
      data: {
        access_token: "my_token",
      },
    });
    const scope = "workspaceId=1234-5678";
    await expect(getJWT(scope)).resolves.toEqual("my_token");
    expect(post).toHaveBeenCalledWith("https://eu.company.org/auth/token", "", {
      headers: {
        Authorization: "Basic dG9kb3M6c2VjcmV0",
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      params: {
        grant_type: "client_credentials",
        scope,
      },
    });
  });
});
