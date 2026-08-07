import { Router } from "express";
import { UserController } from "#src/controllers";
import { verifyJWT } from "#src/middlewares";

const UserRouter = Router();
const { createUser, findAll, findById, findByEmail, update, deleteById } = UserController();

UserRouter.get("/", verifyJWT, findAll);
UserRouter.get("/email/:email", verifyJWT, findByEmail);
UserRouter.get("/:id", findById);
UserRouter.post("/", createUser);
UserRouter.put("/:id", verifyJWT, update);
UserRouter.delete("/:id", verifyJWT, deleteById);

export { UserRouter };
export default UserRouter;
