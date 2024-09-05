import { Knex } from "knex";
import { getTestConfig } from "./get-test.config";

jest.mock("os", () => ({
  tmpdir: () => "tmpdir",
}));
jest.mock("fs", () => ({
  readFileSync: () => "42",
}));

describe("the production configuration", () => {
  it("reads the database port from the temporary file", () => {
    expect(getTestConfig({})).toHaveProperty("database", {
      database: "postgres",
      host: "localhost",
      password: "secret",
      port: 42,
      ssl: false,
      user: "postgres",
    } as Knex.PgConnectionConfig);
  });
});
