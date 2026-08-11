import { prisma } from "../src/services/prisma.js";

const categorias = [
  { nome: "Livros e apostilas", slug: "livros-e-apostilas" },
  { nome: "Eletrônicos", slug: "eletronicos" },
  { nome: "Materiais acadêmicos", slug: "materiais-academicos" },
  { nome: "Papelaria", slug: "papelaria" },
  { nome: "Roupas e acessórios", slug: "roupas-e-acessorios" },
  { nome: "Móveis e decoração", slug: "moveis-e-decoracao" },
  { nome: "Esportes e lazer", slug: "esportes-e-lazer" },
  { nome: "Outros", slug: "outros" },
];

async function seedCategorias() {
  await Promise.all(
    categorias.map((categoria) =>
      prisma.categoria.upsert({
        where: { slug: categoria.slug },
        update: { nome: categoria.nome },
        create: categoria,
      }),
    ),
  );

  console.log(`${categorias.length} categorias cadastradas.`);
}

seedCategorias()
  .catch((error) => {
    console.error("Não foi possível cadastrar as categorias.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
