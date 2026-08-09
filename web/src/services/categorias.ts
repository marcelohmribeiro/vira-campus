import { api } from 'src/services/_api'
import type { Categoria } from 'src/types'

export async function listarCategorias(signal?: AbortSignal) {
	const response = await api.get<Categoria[]>('/categorias', { signal })
	return response.data
}
