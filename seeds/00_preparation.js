
exports.seed = async (knex, Promise) => {
  const relationship = knex("relationship")
    .del()
    .catch((err) => {
      console.log("\nError del relationship: ", err.message);
    });

  if (typeof relationship === "undefined") {
    return;
  }

  const coordinates = knex("coordinates")
    .del()
    .catch((err) => {
      console.log("\nError del coordinates: ", err.message);
    });

  if (typeof coordinates === "undefined") {
    return;
  }

  const account = knex("account")
    .del()
    .catch((err) => {
      console.log("\nError del account: ", err.message);
    });

  if (typeof account === "undefined") {
    return;
  }

  const userCredentials = await knex("user_credentials")
    .del()
    .catch((err) => {
      console.log("\nError del user_credentials: ", err.message);
    });
};
