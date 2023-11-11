const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./db/mongoose");
const pipelineRouter = require("./routes/pipelineRouter");
const stageRouter = require("./routes/stageRouter");
const leadRouter = require("./routes/leadRouter");
const ownerRouter = require("./routes/ownerRouter");
const dealRouter = require("./routes/dealRouter");
const globalErrorHandler = require("./controller/errorController");
const authorization = require("./middleware/authorization");

const app = express();
app.use(express.json());

// Routes
app.use("/pipelines", authorization, pipelineRouter);
app.use("/stages", authorization, stageRouter);
app.use("/leads", authorization, leadRouter);
app.use("/users", ownerRouter);
app.use("/deals", authorization, dealRouter);
app.use(globalErrorHandler);

module.exports = app;
