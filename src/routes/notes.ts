import express, { Router } from "express";
import NotesController from "../controllers/notes";
// Importo Middleware para autenticar
import authenticateMiddleware from "../middlewares/authenticate";

//importar controladora de Notas
const controller: NotesController = new NotesController();

// Instacio el router de express
var NotesRouter: Router = express.Router();


// Defino rutas publicas
NotesRouter.get("/count", controller.getAllNotesCount);

// Definir las rutas para Clientes
NotesRouter.get("/", authenticateMiddleware, controller.getAllNotes);
NotesRouter.get("/:id", authenticateMiddleware, controller.getNoteById);
NotesRouter.post("/", authenticateMiddleware, controller.createNote);
NotesRouter.put("/:id", authenticateMiddleware, controller.updateNote);
NotesRouter.delete("/:id", authenticateMiddleware, controller.deleteNote);

export = NotesRouter;
