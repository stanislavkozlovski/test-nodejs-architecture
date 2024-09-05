import { GenericContainer, StartedTestContainer } from "testcontainers";
import { mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";

function spawnDatabase(): Promise<StartedTestContainer> {
  return new GenericContainer("postgres:14")
    .withEnv("POSTGRES_USER", "postgres")
    .withEnv("POSTGRES_DB", "postgres")
    .withEnv("POSTGRES_PASSWORD", "secret")
    .withExposedPorts(5432)
    .withTmpFs({ "/temp_pgdata": "rw,noexec,nosuid,size=65536k" })
    .start();
}

async function shareDatabaseConfig(container: StartedTestContainer) {
  const variablesDir = path.join(
    os.tmpdir(),
    "jest_testcontainers_global_setup"
  );
  await mkdir(variablesDir, { recursive: true });
  await writeFile(
    path.join(variablesDir, "databasePort"),
    container.getMappedPort(5432).toString()
  );
}

function shareContainerForTeardown(container: StartedTestContainer) {
  (globalThis as any).__DATABASE_CONTAINER__ = container;
}

async function setupDatabase(): Promise<void> {
  const container = await spawnDatabase();
  await shareDatabaseConfig(container);
  shareContainerForTeardown(container);
}

module.exports = setupDatabase;
