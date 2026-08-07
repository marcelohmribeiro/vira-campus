import { prisma } from "#src/service";
import bcrypt from "bcryptjs";

const UserController = () => {
  async function createUser(req, res, next) {
    try {
      const { nome, email, senha } = req.body;

      const userExists = await prisma.usuario.findUnique({ where: { email } });
      if(userExists) {
        return res.status(400).json({ error: "Usuário já cadastrado" });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const data = await prisma.usuario.create({
        data: {
          nome,
          email,
          senhaHash
      },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if('senha' in data) delete data.senha
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async function findAll(req, res, next) {
    try {
      const users = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async function findById(req, res, next) {
    const { id } = req.params;
    try {
      const user = await prisma.usuario.findById({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async function findByEmail(req, res, next) {
    const { email } = req.params;
    try {
      const user = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async function update(req, res, next) {
    const { id } = req.params;
    const data = req.body;
    try {
      await prisma.usuario.update({
      where: { id },
      data,
    });
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async function deleteById(req, res, next) {
    const { id } = req.params;
    try {
      const userDeleted = await prisma.usuario.delete({ where: { id } });
      return res.status(204).json(userDeleted);
    } catch (error) {
      next(error);
    }
  }

  // async function deleteByEmail(req, res) {
  //   const { email } = req.params;
  //   try {
  //     const userDeleted = await prisma.usuario.deleteByEmail(email);
  //     return res.status(204).json(userDeleted);
  //   } catch (error) {
  //     return res.status(400).json({ error: error.message });
  //   }
  // }

  return {
    createUser,
    findAll,
    findById,
    findByEmail,
    update,
    deleteById,
    // deleteByEmail,
  }
}

export { UserController };
export default UserController;
