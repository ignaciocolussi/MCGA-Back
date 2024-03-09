import express, { Router } from "express";

import { UsersController } from "../controllers/users";

// Importo Middleware para autenticar
import authenticateMiddleware from "../middlewares/authenticate";

//importar controladora de Usuarios
const controller: UsersController = new UsersController();

// Instacio el router de express
var UsersRouter: Router = express.Router();

// Defino rutas publicas
UsersRouter.get("/count", controller.getAllCount);

// Definir las rutas para Clientes
UsersRouter.post("/signup", controller.signup);
UsersRouter.post("/login", controller.login);
UsersRouter.post("/logout", authenticateMiddleware, controller.logout);
UsersRouter.put("/update/:id", authenticateMiddleware, controller.update);

export = UsersRouter;
