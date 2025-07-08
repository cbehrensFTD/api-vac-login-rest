import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";

dotenv.config({ path: ".env.dev" });

import authRouter from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("¡Bienvenido a la API de Portal de Vacaciones!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
