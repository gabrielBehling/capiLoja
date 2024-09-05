var express = require("express");
var helmet = require("helmet");
var path = require("path");
var mustache = require("mustache-express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

import mainRouter from "./routes/index";
import productsRouter from "./routes/products";
import sellersRouter from "./routes/sellers";
import { getDatabase } from "./database/database";

const server = express();

server.use(helmet());
server.use(express.static(path.join(__dirname, "../public")));

server.set("view engine", "mustache");
server.set("views", path.join(__dirname, "views"));
server.engine("mustache", mustache());

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));

server.use(mainRouter);
server.use("/products", productsRouter);
server.use("/sellers", sellersRouter);

server.use((req, res) => {
	res.render("pages/404");
});

server.listen(process.env.PORT);
