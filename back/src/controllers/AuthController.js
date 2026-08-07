import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "#src/service";
import { settings } from "#src/config";

const AuthController = () => {
  async function login(req, res, next) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
      }

      const data = await prisma.usuario.findUnique({
        where: { email }
      })
      if(!data) {
        return res.status(401).json({ error: "E-mail ou senha inválidos" });
      }

      const checkPassword = await bcrypt.compare(senha, data.senhaHash);
      if (!checkPassword) {
        return res.status(401).json({ error: "E-mail ou senha inválidos" });
      }

      const token = jwt.sign(
        { id: data.id },
        settings.JWT_SECRET,
        { expiresIn: "1d" },
      );
      data.token = token
      if ('senha' in data) delete data.senha
      res.json(data)
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
