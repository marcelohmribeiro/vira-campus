import { prisma } from "#src/services/index.js";
import { createAnuncioSchema, updateAnuncioSchema } from "#src/schemas"

const AnuncioController = () => {
  async function create(req, res, next) {
    try {
      const usuarioId = req.user.id;
      if (!req.file) {
        return res.status(400).json({ error: "Imagem é obrigatória" });
      }
      const parsed = createAnuncioSchema.parse(req.body);

      const categoria = await prisma.categoria.findUnique({
        where: { id: parsed.categoriaId },
      });
      if (!categoria) {
        return res.status(400).json({ error: "Categoria não encontrada" });
      }

      const preco = parsed.tipo === "DOACAO" ? null : parsed.preco;
      const data = await prisma.anuncio.create({
        data: {
          titulo: parsed.titulo,
          descricao: parsed.descricao,
          tipo: parsed.tipo,
          preco,
          imagemUrl: req.file.path,
          categoriaId: parsed.categoriaId,
          usuarioId,
        },
      });
      return res.status(201).json(data);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  }

  async function findAll(req, res, next) {
    try {
      const data = await prisma.anuncio.findMany();
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

      const data = await prisma.anuncio.findUnique({
        where: { id },
      });
      if (!data) {
        return res.status(404).json({ error: "Anuncio não encontrado" });
      }

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async function update(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const anuncio = await prisma.anuncio.findUnique({ where: { id } });
      if (!anuncio) {
        return res.status(404).json({ error: "Anuncio não encontrado" });
      }
      if (anuncio.usuarioId !== usuarioId) {
        return res.status(403).json({ error: "Você não tem permissão para editar este anúncio" });
      }

      const parsed = updateAnuncioSchema.parse(req.body);
      const tipoFinal = parsed.tipo ?? anuncio.tipo;
      const precoFinal = tipoFinal === "DOACAO" ? null : (parsed.preco ?? anuncio.preco);

      if (tipoFinal === "VENDA" && !precoFinal) {
        return res.status(400).json({ error: "Preço é obrigatório para anúncios de venda" });
      }
      if (parsed.categoriaId) {
        const categoria = await prisma.categoria.findUnique({
          where: { id: parsed.categoriaId },
        });
        if (!categoria) {
          return res.status(400).json({ error: "Categoria não encontrada" });
        }
      }

      const imagemUrlFinal = req.file?.path ?? anuncio.imagemUrl;
      const data = await prisma.anuncio.update({
        where: { id },
        data: { ...parsed, preco: precoFinal, imagemUrl: imagemUrlFinal },
      });

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async function deleteById(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const anuncio = await prisma.anuncio.findUnique({ where: { id } });
      if (!anuncio) {
        return res.status(404).json({ error: "Anuncio não encontrado" });
      }
      if (anuncio.usuarioId !== usuarioId) {
        return res.status(403).json({ error: "Você não tem permissão para deletar este anúncio" });
      }

      await prisma.anuncio.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  return {
    create,
    findAll,
    findById,
    update,
    deleteById,
  };
};

export { AnuncioController };
export default AnuncioController;
