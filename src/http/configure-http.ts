import axios from "axios";
import { attachAuthorizationHeader } from "./authorization-header.interceptor";
import { createHttpAgent, createHttpsAgent } from "./create-http-agents";
import { logRequest } from "./log-request.interceptor";
import { logResponse } from "./log-response.interceptor";

export function configureHttp(): void {
  axios.defaults.httpAgent = createHttpAgent();
  axios.defaults.httpsAgent = createHttpsAgent();
  axios.interceptors.request.use(attachAuthorizationHeader);
  axios.interceptors.request.use(logRequest);
  axios.interceptors.response.use(logResponse);
}
