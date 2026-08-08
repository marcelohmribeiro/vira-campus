import express from "express";
import { AuthRouter, UserRouter, AnuncioRouter } from "#src/routes";
import { settings } from "#src/config";
import cors from "cors";

const app = express();
const port = settings.PORT;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Servidor rodando");
});
app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/anuncios", AnuncioRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
