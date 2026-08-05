import { UserService } from "../services/UserService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthController {
  constructor() {
    this.userService = new UserService();
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await this.userService.findByEmail(email);
      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
