export default {
  development: {
    client: "pg",
    connection: {
      database: "my_database",
      user: "postgres",
      password: "yourpassword",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
