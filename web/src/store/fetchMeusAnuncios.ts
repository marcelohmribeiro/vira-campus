import { listarMeusAnuncios } from 'src/services'
import { createPaginationStore } from 'src/store/createPaginationStore'
import type { Anuncio, FiltrosMeusAnuncios } from 'src/types'

export const useMeusAnunciosStore = createPaginationStore<
	Anuncio,
	FiltrosMeusAnuncios
>(
	(page, limit, filtros) => listarMeusAnuncios({ page, limit, ...filtros }),
	'Não foi possível carregar seus anúncios.',
)
