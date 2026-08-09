import { api } from 'src/services/_api'
import type { Anuncio, AnuncioFormValues } from 'src/types'

interface RequestOptions {
	signal?: AbortSignal
}

function createAnuncioFormData(values: AnuncioFormValues) {
	const data = new FormData()

	data.append('titulo', values.titulo)
	data.append('descricao', values.descricao)
	data.append('tipo', values.tipo)
	data.append('categoriaId', String(values.categoriaId))

	if (values.tipo === 'VENDA' && values.preco !== null) {
		data.append('preco', String(values.preco))
	}

	if (values.imagem) data.append('imagem', values.imagem)

	return data
}

export async function listarMeusAnuncios(options: RequestOptions = {}) {
	const response = await api.get<Anuncio[]>('/anuncios/meus', options)
	return response.data
}

export async function buscarAnuncio(id: number, options: RequestOptions = {}) {
	const response = await api.get<Anuncio>(`/anuncios/${id}`, options)
	return response.data
}

export async function criarAnuncio(values: AnuncioFormValues) {
	const response = await api.post<Anuncio>('/anuncios', createAnuncioFormData(values))
	return response.data
}

export async function editarAnuncio(id: number, values: AnuncioFormValues) {
	const response = await api.put<Anuncio>(`/anuncios/${id}`, createAnuncioFormData(values))
	return response.data
}

export async function removerAnuncio(id: number) {
	await api.delete(`/anuncios/${id}`)
}
