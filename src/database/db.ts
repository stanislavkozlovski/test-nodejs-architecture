import { Knex } from "knex";
import { types } from "pg";
import { config } from "../configuration/config";

types.setTypeParser(1082, (date: string) => date);

export const db = require("knex")({
  client: "pg",
  connection: config.database,
}) as Knex;
