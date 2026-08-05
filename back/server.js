import * as dotenv from "dotenv";
import express from "express";
import AuthRouter from "./src/routes/AuthRoutes.js";
import UserRouter from "./src/routes/UserRoutes.js";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use("/", (req, res) => {
  res.send("Servidor rodando");
});
app.use("/auth", AuthRouter);
app.use("/users", UserRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
