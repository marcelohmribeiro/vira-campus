# ViraCampus

Plataforma para estudantes anunciarem, venderem e doarem produtos dentro da comunidade acadêmica.

Projeto full-stack desenvolvido para o desafio **Marketplace de Economia Circular do Campus**, do Laboratório Vortex/UNIFOR.

- **Frontend:** [vira-campus.vercel.app](https://vira-campus.vercel.app)
- **API:** [vira-campus-efgr.vercel.app](https://vira-campus-efgr.vercel.app)

## Funcionalidades

- Cadastro e autenticação com JWT.
- Exploração de anúncios por categoria, tipo e busca textual.
- Criação de anúncios de venda ou doação com upload de imagem.
- Página de detalhes do produto e informações do anunciante.
- Histórico dos anúncios do usuário.
- Edição e exclusão de anúncios próprios.
- Edição do nome e da foto de perfil.
- Interface responsiva para celular, tablet e desktop.
- Instalação como PWA e cache básico para navegação.

## Tecnologias

| Camada | Tecnologias principais |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/Radix UI |
| Estado e dados | Zustand, Axios, React Router |
| Backend | Node.js, Express, Zod, JWT, bcryptjs |
| Banco de dados | PostgreSQL (Supabase em produção), Prisma ORM |
| Imagens | Multer e Cloudinary |
| Infraestrutura | Vercel e PWA |

## Estrutura do projeto

```text
viracampus/
├── back/
│   ├── prisma/          # Schema e migrations
│   ├── src/
│   │   ├── controllers/ # Regras das requisições
│   │   ├── middlewares/ # JWT e upload
│   │   ├── routes/      # Rotas da API
│   │   ├── schemas/     # Validação com Zod
│   │   └── services/    # Prisma e integrações
│   └── server.js
├── web/
│   ├── public/          # Manifesto, service worker e ícones
│   └── src/
│       ├── components/  # Componentes reutilizáveis
│       ├── pages/       # Páginas públicas e autenticadas
│       ├── services/    # Comunicação com a API
│       ├── store/       # Estado global
│       └── types/       # Tipos TypeScript
└── README.md
```

## Executando localmente

### Pré-requisitos

- Node instalado
- Bun (opcional)
- PostgreSQL local ou em nuvem.
- Conta no Cloudinary para upload de imagens.

### Backend

```bash
cd back
cp .env.example .env
```

Preencha o arquivo `back/.env`:

```env
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=verify-full&schema=viracampus
FRONTEND_URL=http://localhost:5173
PORT=8081
JWT_SECRET=uma-chave-secreta-forte
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret
```

O `npm install` executa `prisma generate` automaticamente. Por isso, salve o `.env` antes de instalar as dependências.

O Prisma atual mapeia os modelos para o schema `viracampus`; o parâmetro `schema=viracampus` na `DATABASE_URL` é obrigatório. Em um banco novo, crie o schema uma vez:

```sql
CREATE SCHEMA IF NOT EXISTS viracampus;
```

```bash
bun install
bunx prisma generate
bunx prisma db push
bun start
```

A API ficará disponível em `http://localhost:8081`.

Cadastre as categorias iniciais executando o seed do Prisma:

```bash
bunx prisma db seed
```

### Frontend

```bash
cd web
bun install
cp .env.example .env
```

Preencha o arquivo `web/.env`:

```env
VITE_APP_NAME=viracampus
VITE_API_URL=http://localhost:8081
```

Inicie o Vite:

```bash
bun dev
```

O frontend ficará disponível em `http://localhost:5173`.

## Endpoints da API

Rotas protegidas esperam o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/` | Não | Verifica se a API está disponível |
| `POST` | `/auth/login` | Não | Autentica o usuário |
| `POST` | `/users` | Não | Cria uma conta |
| `GET` | `/users` | Sim | Lista usuários |
| `GET` | `/users/:id` | Sim | Busca um usuário |
| `GET` | `/users/email/:email` | Sim | Busca um usuário pelo e-mail |
| `PUT` | `/users/me` | Sim | Atualiza nome e foto do usuário |
| `DELETE` | `/users/me` | Sim | Exclui a conta autenticada |
| `GET` | `/categorias` | Sim | Lista categorias |
| `GET` | `/categorias/:id` | Sim | Busca uma categoria |
| `GET` | `/anuncios` | Sim | Lista anúncios |
| `GET` | `/anuncios/meus` | Sim | Lista os anúncios do usuário |
| `GET` | `/anuncios/:id` | Sim | Busca os detalhes de um anúncio |
| `POST` | `/anuncios` | Sim | Cria um anúncio |
| `PUT` | `/anuncios/:id` | Sim | Atualiza um anúncio próprio |
| `DELETE` | `/anuncios/:id` | Sim | Exclui um anúncio próprio |

## PWA

O frontend possui manifesto, ícones e service worker. Em produção, o service worker é registrado automaticamente e mantém em cache o shell da aplicação e recursos estáticos do mesmo domínio.

## Deploy

O frontend e o backend são projetos separados na Vercel:

- **Frontend:** Root Directory `web`, build `bun run build` e saída `dist`.
- **Backend:** Root Directory `back`, utilizando o `server.js` configurado em `back/vercel.json`.

No frontend, configure `VITE_APP_NAME` e `VITE_API_URL`. No backend, configure todas as variáveis de `back/.env.example` e use a URL pública do frontend em `FRONTEND_URL`.

## Diário de bordo da IA

### Ferramenta utilizada

Entre as ferramentas de IA utilizadas, o **OpenAI Codex** atuou como assistente de desenvolvimento. A ferramenta apoiou a leitura do projeto, implementação e refatoração de componentes React, integração com os endpoints existentes, diagnóstico de erros e validação por lint, TypeScript e build. As decisões finais e os commits permaneceram sob revisão humana.

### Estratégia de engenharia de prompt

Os prompts combinaram quatro elementos:

1. Objetivo funcional claro.
2. Arquivos e fluxos envolvidos.
3. Restrições de escopo, legibilidade e responsividade.
4. Critérios verificáveis de conclusão.

O desenvolvimento foi incremental. Primeiro eram inspecionados os contratos existentes; depois, a tarefa era dividida entre interface, integração e validação. Os prompts seguintes serviam para revisar o resultado e corrigir decisões que não correspondiam às regras reais do projeto.

### Três prompts complexos

**1. Diagnóstico de instalação e funcionamento da PWA**
> Estou desenvolvendo um marketplace em React e preciso transformá-lo 
em PWA instalável no celular. Eu segui a documentação basica do mozzila e gerei um manifest.json e um 
service-worker.js iniciais — pode revisar se estão bons? [@web/public/manifest.json] [@web/public/service-worker.js]

**2. Ajuda na construção de layouts e componentes**
> Codex, já tenho a base da tela principal pronta. Quero que você use os fundamentos de UI/UX pra desenvolver a tela principal 
que lista os produtos, de forma impecável. Em [@web/src/components/ui] tem componentes do shadcn para você utilizar.

**3. Revisão de segurança e consistência com os controllers**
> Estou desenvolvendo um marketplace onde as pessoas anunciam seus pertences. Eu desenvolvi a regra de negocio para lidar com os anuncios e os usuários, quero que você revise e procure falhas de segurança, veja nesses arquivos [@back/src/controllers/AnuncioController.js]
[@back/src/controllers/UserController.js]

### Reflexão crítica

Pedi pra IA corrigir um erro de config no backend. Ela sugeriu algo baseado numa versão antiga da ferramenta, e na hora que fui aplicar, deu erro.

Colei o erro de volta sem tentar adivinhar. Ela tentou de novo, errou de novo — mesmo tipo de problema. Só na segunda vez ela "admitiu" que talvez tivesse informação desatualizada e sugeriu ir atrás da documentação antes de chutar mais uma vez.

Aí sim resolveu — a mudança era bem mais profunda do que qualquer ajuste pontual ia resolver.

Aprendi que colar o erro real (em vez de tentar resumir com minhas palavras) ajuda muito mais a IA a perceber quando ela tá "chutando" no escuro — e pedir pra ela pesquisar antes de tentar de novo economiza um monte de volta desnecessária.