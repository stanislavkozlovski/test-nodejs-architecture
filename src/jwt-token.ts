import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { WithWorkspaceId } from "./workspace-id.type";

export type JwtTokenPayload = JwtPayload & WithWorkspaceId;

export function getToken(response: Response): JwtTokenPayload {
  return response.locals.token;
}
