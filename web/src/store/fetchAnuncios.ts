import { listarTodosAnuncios } from 'src/services'
import { createPaginationStore } from 'src/store/createPaginationStore'
import type { Anuncio, FiltrosAnuncios } from 'src/types'

export const useAnunciosStore = createPaginationStore<Anuncio, FiltrosAnuncios>(
	(page, limit, filtros) => listarTodosAnuncios({ page, limit, ...filtros }),
	'Não foi possível carregar os anúncios.',
)
