import { Config, ProcessVariables } from "../config.type";

export function getProductionConfig(
  processVariables: ProcessVariables
): Config {
  return {
    environment: "production",
    logLevel: processVariables.LOG_LEVEL ?? "info",
    authentication: {
      enabled: true,
      jwksUrl:
        processVariables.JWKS_URL ??
        "<JWKS_URL> needs to be set in production environment",
    },
    database: {
      connectionString: processVariables.DATABASE_URL,
      ssl: true,
    },
    http: {
      servicesUrl:
        processVariables.SERVICES_URL ??
        "<SERVICES_URL> needs to bet set in production environment",
      clientId:
        processVariables.CLIENT_ID ??
        "<CLIENT_ID> needs to bet set in production environment",
      clientSecret:
        processVariables.CLIENT_SECRET ??
        "<CLIENT_SECRET> needs to bet set in production environment",
    },
  };
}
