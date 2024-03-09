import dotenv from "dotenv";
import app from "./app";
import mongoose from "mongoose";

dotenv.config();

const port: string = process.env.PORT || "3000";

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@anotador.0m2ovol.mongodb.net/` ||
      ""
  )
  .then(() => {
    console.log("[db]: Connected to database");
  })
  .catch((error) => {
    console.log(`[db]: ${error}`);
  });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
