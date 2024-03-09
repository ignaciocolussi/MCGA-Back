import express, { Router } from "express";
import TagsController from "../controllers/tags";
// Importo Middleware para autenticar
import authenticateMiddleware from "../middlewares/authenticate";

//importar controladora de Notas
const controller: TagsController = new TagsController();

// Instacio el router de express
var TagsRouter: Router = express.Router();

// Defino rutas publicas
TagsRouter.get("/count", controller.getAllTagsCount);

// Definir las rutas para Clientes
TagsRouter.get("/", authenticateMiddleware, controller.getAllTags);
TagsRouter.delete("/:id", authenticateMiddleware, controller.deleteTag);
TagsRouter.post("/", authenticateMiddleware, controller.createTag);

export = TagsRouter;
