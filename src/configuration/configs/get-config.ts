import { Config, Environment, ProcessVariables } from "../config.type";
import { getTestConfig } from "./get-test.config";
import { getLocalConfig } from "./get-local.config";
import { getProductionConfig } from "./get-production.config";

export function getConfig(processVariables: ProcessVariables): Config {
  const environment: Environment = processVariables.ENV || "local";
  switch (environment) {
    case "production":
      return getProductionConfig(processVariables);
    case "local":
      return getLocalConfig(processVariables);
    case "test":
      return getTestConfig(processVariables);
  }
}
