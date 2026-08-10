import { api } from 'src/services/_api'
import type { Usuario } from 'src/types'

export interface PerfilFormValues {
	nome: string
	imagem: File | null
}

function createPerfilFormData(values: PerfilFormValues) {
	const data = new FormData()

	data.append('nome', values.nome)
	if (values.imagem) data.append('imagem', values.imagem)

	return data
}

export async function atualizarPerfil(values: PerfilFormValues) {
	const response = await api.put<Usuario>('/users/me', createPerfilFormData(values))
	return response.data
}
