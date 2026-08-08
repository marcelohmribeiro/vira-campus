import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "#src/services/index.js";
import { settings } from "#src/config";

const AuthController = () => {
  async function login(req, res, next) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { email }
      })
      if(!usuario) {
        return res.status(401).json({ error: "E-mail ou senha inválidos" });
      }

      const checkPassword = await bcrypt.compare(senha, usuario.senhaHash);
      if (!checkPassword) {
        return res.status(401).json({ error: "E-mail ou senha inválidos" });
      }

      const token = jwt.sign(
        { id: usuario.id },
        settings.JWT_SECRET,
        { expiresIn: "1d" },
      );
      
      return res.json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        fotoPerfilUrl: usuario.fotoPerfilUrl,
        token
      })
    } catch (error) {
    next(error);
    }
  }
    return {
        login
    }
}

export { AuthController };
export default AuthController;
