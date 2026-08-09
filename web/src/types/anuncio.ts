export type TipoAnuncio = "VENDA" | "DOACAO"
export type StatusAnuncio = "ATIVO" | "RESERVADO" | "CONCLUIDO"

export interface Categoria {
  id: number
  nome: string
  slug: string
}

export interface Usuario {
  id: number
  nome: string
  email: string
  fotoPerfilUrl: string | null
}

export type Anunciante = Pick<Usuario, "id" | "nome" | "fotoPerfilUrl">

export interface AnuncioFormValues {
  titulo: string
  descricao: string
  tipo: TipoAnuncio
  preco: number | null
  categoriaId: number
  imagem: File | null
}

export interface Anuncio {
  id: number
  titulo: string
  descricao: string
  tipo: TipoAnuncio
  preco: number | null
  imagemUrl: string
  status: StatusAnuncio
  usuarioId: number
  usuario?: Anunciante
  categoriaId: number
  categoria?: Categoria
  createdAt: string
  updatedAt: string
}
