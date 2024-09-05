import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("todos", (table) => {
    table.boolean("delayNotificationSent").defaultTo(false).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("todos", (table) => {
    table.dropColumn("delayNotificationSent");
  });
}
