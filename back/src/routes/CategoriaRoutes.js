import { Router } from "express";
import { CategoriaController } from "#src/controllers";
import { verifyJWT } from "#src/middlewares";

const CategoriaRouter = Router();
const { findAll, findById } = CategoriaController();

CategoriaRouter.get("/", verifyJWT, findAll);
CategoriaRouter.get("/:id", verifyJWT, findById);

export { CategoriaRouter };
export default CategoriaRouter;
