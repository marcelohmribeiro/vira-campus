import { prisma } from "#src/services/index.js";

const CategoriaController = () => {
  async function findAll(req, res, next) {
    try {
      const data = await prisma.categoria.findMany();

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async function findById(req, res, next) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const data = await prisma.categoria.findUnique({
        where: { id },
      });

      if (!data) {
        return res.status(404).json({ error: "Categoria não encontrado" });
      }

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  return {
    findAll,
    findById,
  };
};

export { CategoriaController };
export default CategoriaController;
