import express from "express";
import { AuthRouter, UserRouter, AnuncioRouter, CategoriaRouter } from "#src/routes";
import { handleError } from "#src/utils"
import { settings } from "#src/config";
import cors from "cors";

const app = express();
const port = settings.PORT;
app.use(cors({
  origin: `${settings.FRONTEND_URL}`,
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.json("Servidor rodando");
});
app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/anuncios", AnuncioRouter);
app.use("/categorias", CategoriaRouter);
app.use(handleError);

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
