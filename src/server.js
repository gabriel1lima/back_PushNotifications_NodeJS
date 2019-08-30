const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
try { var urlConnectMongo = require("./config/urlConnectMongo") } catch (error) {}

const app = express();

const mongoose = require("mongoose");
const server = require("http").Server(app);

mongoose.connect(urlConnectMongo, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require("./routes"));

server.listen(3000, () => {
  console.log("Server started on port 3000!");
});
