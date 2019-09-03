const express = require("express");
const routes = express.Router();

const authMiddleware = require('./middlewares/auth');

// routes.use(authMiddleware);

const TodoController = require("./controllers/TodoController");
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");

routes.post("/auth/register", AuthController.register);
routes.post("/auth/login", AuthController.login);
routes.post("/auth/token", AuthController.token);

routes.get("/user", UserController.getAll);
routes.delete("/user/:id", authMiddleware, UserController.delete);

routes.get("/todos", authMiddleware, TodoController.getAll);
routes.get("/todos/:id_user", authMiddleware, TodoController.getByUserID);
routes.post("/todos", authMiddleware, TodoController.create);
routes.delete("/todos/:id", authMiddleware, TodoController.delete);
routes.put("/todos/:id", authMiddleware, TodoController.update);

module.exports = routes;