// Importo librerias
import express, { Express, Request, Response, Router } from "express";
import cors from "cors";
import TagsRouter from "./routes/tags";
import UsersRouter from "./routes/users";

var app = express();

// Defino etension json
app.use(express.json());

// Defino cors
app.use(cors<Request>());

// Defino las rutas
app.use("/tags", TagsRouter);
app.use("/users", UsersRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//exportar la app
export = app;
