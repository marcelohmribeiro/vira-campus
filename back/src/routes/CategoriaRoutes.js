import { Router } from "express";
import { CategoriaController } from "#src/controllers";

const CategoriaRouter = Router();
const { findAll, findById } = CategoriaController();

CategoriaRouter.get("/", findAll);
CategoriaRouter.get("/:id", findById);

export { CategoriaRouter };
export default CategoriaRouter;
