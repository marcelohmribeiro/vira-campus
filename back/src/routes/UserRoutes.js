import { Router } from "express";
import { UserController } from "../controllers/UserController.js";

const router = Router();
const userController = new UserController();

router.get("/", userController.findAll.bind(userController));
router.get("/:id", userController.findById.bind(userController));
router.get("/email/:email", userController.findByEmail.bind(userController));
router.post("/", userController.createUser.bind(userController));
router.put("/:id", userController.update.bind(userController));
router.delete("/:id", userController.deleteById.bind(userController));

export default router;
