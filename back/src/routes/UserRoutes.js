import { Router } from "express";
import { UserController } from "#src/controllers";
import { verifyJWT, upload } from "#src/middlewares";

const UserRouter = Router();
const { create, findAll, findById, findByEmail, update, deleteById } = UserController();

UserRouter.get("/", verifyJWT, findAll);
UserRouter.get("/email/:email", verifyJWT, findByEmail);
UserRouter.get("/:id", verifyJWT, findById);
UserRouter.post("/", create);
UserRouter.put("/me", verifyJWT, upload.single("imagem"), update);
UserRouter.delete("/me", verifyJWT, deleteById);

export { UserRouter };
export default UserRouter;
