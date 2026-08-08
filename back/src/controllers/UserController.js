import { prisma } from "#src/services/index.js";
import { createUsuarioSchema, updateUsuarioSchema } from "#src/schemas/index.js";
import bcrypt from "bcryptjs";

const usuarioSelect = {
  id: true,
  nome: true,
  email: true,
  fotoPerfilUrl: true,
  createdAt: true,
  updatedAt: true,
};

const UserController = () => {
  async function create(req, res, next) {
    try {
      const parsed = createUsuarioSchema.parse(req.body);

      const userExists = await prisma.usuario.findUnique({ where: { email: parsed.email } });
      if(userExists) {
        return res.status(400).json({ error: "Usuário já cadastrado" });
      }

      const senhaHash = await bcrypt.hash(parsed.senha, 10);
      const data = await prisma.usuario.create({
        data: {
          nome: parsed.nome,
          email: parsed.email,
          senhaHash
      },
        select: usuarioSelect,
      });

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async function findAll(req, res, next) {
    try {
      const users = await prisma.usuario.findMany({
      select: usuarioSelect,
    });
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async function findById(req, res, next) {
    try {
      const { id } = req.params;
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: usuarioSelect,
    });

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async function findByEmail(req, res, next) {
    try {
      const { email } = req.params;

      const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: usuarioSelect,
    });

      if(!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async function update(req, res, next) {
    try {
      const id = req.user.id;
      const parsed = updateUsuarioSchema.parse(req.body);
      
      if (Object.keys(parsed).length === 0 && !req.file) {
        return res.status(400).json({ error: "Nenhum dado para atualizar" });
      }

      const usuarioAtual = await prisma.usuario.findUnique({ where: { id } });
      const fotoPerfilUrlFinal = req.file?.path ?? usuarioAtual.fotoPerfilUrl;

      const data = await prisma.usuario.update({
      where: { id },
      data: {
        ...parsed,
        fotoPerfilUrl: fotoPerfilUrlFinal,
      },
      select: usuarioSelect
    });
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async function deleteById(req, res, next) {
    try {
      const id = req.user.id;
      await prisma.usuario.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  return {
    create,
    findAll,
    findById,
    findByEmail,
    update,
    deleteById
  }
}

export { UserController };
export default UserController;
