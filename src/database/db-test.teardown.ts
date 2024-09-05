export async function teardownDatabase(): Promise<void> {
  (globalThis as any).__DATABASE_CONTAINER__.stop();
}

module.exports = teardownDatabase;
