const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const publicApiRouter = require("./router/PublicApiRouter");
const apiRouter = require("./router/ApiRouter");

app.use("/publicapi", publicApiRouter);
app.use("/api", apiRouter);

module.exports = app;
