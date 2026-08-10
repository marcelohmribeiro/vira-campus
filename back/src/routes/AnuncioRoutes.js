import { Router } from "express";
import { AnuncioController } from "#src/controllers";
import { upload, verifyJWT } from "#src/middlewares";

const AnuncioRouter = Router();
const { create, findAll, findById, update, deleteById, findByUsuarioId } = AnuncioController();

AnuncioRouter.get("/", verifyJWT, findAll);
AnuncioRouter.get("/meus", verifyJWT, findByUsuarioId);
AnuncioRouter.get("/:id", verifyJWT, findById);
AnuncioRouter.post("/", verifyJWT, upload.single("imagem"), create);
AnuncioRouter.put("/:id", verifyJWT, upload.single("imagem"), update);
AnuncioRouter.delete("/:id", verifyJWT, deleteById);

export { AnuncioRouter };
export default AnuncioRouter;
