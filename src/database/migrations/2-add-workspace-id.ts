import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("todos", (table) => {
    table.uuid("workspaceId").notNullable();
    table.dropPrimary();
    table.primary(["id", "workspaceId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("todos", (table) => {
    table.dropPrimary();
    table.primary(["id"]);
  });
}
