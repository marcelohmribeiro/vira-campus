import { prisma } from "#src/services/index.js";
import {
  createAnuncioSchema,
  listAnunciosQuerySchema,
  listMeusAnunciosQuerySchema,
  updateAnuncioSchema,
} from "#src/schemas";

const anuncioRelations = {
  categoria: {
    select: { 
      id: true, 
      nome: true, 
      slug: true 
    },
  },
  usuario: {
    select: { 
      id: true, 
      nome: true, 
      fotoPerfilUrl: true 
    },
  },
};

function serializeAnuncio(anuncio) {
  return {
    ...anuncio,
    preco: anuncio.preco === null ? null : Number(anuncio.preco),
  };
}

function getOrderBy(order) {
  if (order === "menor-preco") {
    return [{ preco: { sort: "asc", nulls: "first" } }, { id: "desc" }];
  }

  if (order === "maior-preco") {
    return [{ preco: { sort: "desc", nulls: "last" } }, { id: "desc" }];
  }

  return [{ createdAt: "desc" }, { id: "desc" }];
}

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
      const anuncioCriado = await prisma.anuncio.create({
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
      return res.status(201).json(serializeAnuncio(anuncioCriado));
    } catch (error) {
      next(error);
    }
  }

  async function findAll(req, res, next) {
    try {
      const query = listAnunciosQuerySchema.parse(req.query);
      const anuncios = await prisma.anuncio.findMany({
        where: {
          status: "ATIVO",
          ...(query.search && {
            titulo: { contains: query.search, mode: "insensitive" },
          }),
          ...(query.tipo && { tipo: query.tipo }),
          ...(query.categoriaId && { categoriaId: query.categoriaId }),
        },
        orderBy: getOrderBy(query.ordenarPor),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: anuncioRelations,
      });

      return res.status(200).json(anuncios.map(serializeAnuncio));
    } catch (error) {
      next(error);
    }
  }

  async function findById(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const anuncio = await prisma.anuncio.findUnique({
        where: { id },
        include: anuncioRelations,
      });
      if (!anuncio) {
        return res.status(404).json({ error: "Anúncio não encontrado" });
      }

      return res.status(200).json(serializeAnuncio(anuncio));
    } catch (error) {
      next(error);
    }
  }

  async function update(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
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
      const anuncioAtualizado = await prisma.anuncio.update({
        where: { id },
        data: { ...parsed, preco: precoFinal, imagemUrl: imagemUrlFinal },
        include: anuncioRelations,
      });

      return res.status(200).json(serializeAnuncio(anuncioAtualizado));
    } catch (error) {
      next(error);
    }
  }

  async function deleteById(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
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

  async function reserve(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const result = await prisma.anuncio.updateMany({
        where: {
          id,
          status: "ATIVO",
          usuarioId: { not: usuarioId },
        },
        data: { status: "RESERVADO" },
      });

      if (result.count === 0) {
        const anuncio = await prisma.anuncio.findUnique({ where: { id } });

        if (!anuncio) {
          return res.status(404).json({ error: "Anúncio não encontrado" });
        }

        if (anuncio.usuarioId === usuarioId) {
          return res.status(403).json({ error: "Você não pode reservar seu próprio anúncio" });
        }

        return res.status(409).json({ error: "Este anúncio não está mais disponível" });
      }

      const anuncioReservado = await prisma.anuncio.findUnique({
        where: { id },
        include: anuncioRelations,
      });

      if (!anuncioReservado) {
        return res.status(404).json({ error: "Anúncio não encontrado" });
      }

      return res.status(200).json(serializeAnuncio(anuncioReservado));
    } catch (error) {
      next(error);
    }
  }

  async function findByUsuarioId(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const query = listMeusAnunciosQuerySchema.parse(req.query);

      const anuncios = await prisma.anuncio.findMany({
        where: {
          usuarioId,
          ...(query.status && { status: query.status }),
        },
        include: anuncioRelations,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      });
      return res.status(200).json(anuncios.map(serializeAnuncio));
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
    findByUsuarioId,
    reserve,
  };
};

export { AnuncioController };
export default AnuncioController;
