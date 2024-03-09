// Importo librerias
import express, { Express, Request, Response, Router } from "express";
import cors from "cors";

var app = express();

// Defino etension json
app.use(express.json());

// Defino cors
app.use(cors<Request>());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

//exportar la app
export = app;
