import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoaderCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import {
	EmptyState,
	FilterBar,
	ProductCard,
	ProductCardSkeleton,
} from 'src/components'
import type { OrdenarPor, TipoFiltro } from 'src/components/FilterBar'
import { Button } from 'src/components/ui'
import { useInfiniteScroll } from 'src/hooks/useInfiniteScroll'
import { listarCategorias } from 'src/services'
import { useAnunciosStore } from 'src/store/fetchAnuncios'
import type { Categoria, FiltrosAnuncios } from 'src/types'

export default function Explorar() {
	const [categorias, setCategorias] = useState<Categoria[]>([])
	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')
	const [tipo, setTipo] = useState<TipoFiltro>('TODOS')
	const [categoriaId, setCategoriaId] = useState('TODAS')
	const [ordenarPor, setOrdenarPor] = useState<OrdenarPor>('recentes')

	const {
		items: anuncios,
		hasMore,
		isLoading,
		errorMessage,
		loadPage: fetchAnuncios,
	} = useAnunciosStore()

	const filtros = useMemo<FiltrosAnuncios>(() => ({
		search: debouncedSearch.trim() || undefined,
		tipo: tipo === 'TODOS' ? undefined : tipo,
		categoriaId: categoriaId === 'TODAS' ? undefined : Number(categoriaId),
		ordenarPor,
	}), [debouncedSearch, tipo, categoriaId, ordenarPor])

	// Espera o usuario digitar (evitar fazer requisições a cada letra digitada)
	useEffect(() => {
		const timeout = window.setTimeout(() => setDebouncedSearch(search), 300)
		return () => window.clearTimeout(timeout)
	}, [search])

	useEffect(() => {
		const controller = new AbortController()

		listarCategorias(controller.signal)
			.then(setCategorias)
			.catch(() => {
				if (!controller.signal.aborted) {
					toast.error('Não foi possível carregar os dados.')
				}
			})

		return () => controller.abort()
	}, [])

	useEffect(() => {
		void fetchAnuncios(filtros, true)
	}, [fetchAnuncios, filtros])

	const loadMore = useCallback(() => {
		void fetchAnuncios(filtros)
	}, [fetchAnuncios, filtros])
	const loadMoreRef = useInfiniteScroll(
		loadMore,
		hasMore && !isLoading && !errorMessage,
	)

	const hasFilters = search.trim() !== '' || tipo !== 'TODOS' || categoriaId !== 'TODAS'

	function clearFilters() {
		setSearch('')
		setTipo('TODOS')
		setCategoriaId('TODAS')
	}

	const isFirstLoad = isLoading && anuncios.length === 0

	return (
		<div className='mx-auto flex max-w-7xl flex-col gap-6'>
			<header>
				<h1 className='text-2xl font-semibold tracking-[-0.03em] text-foreground'>Explorar anúncios</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					{isFirstLoad ? 'Carregando anúncios...' : `${anuncios.length} anúncio(s) carregado(s)`}
				</p>
			</header>

			<FilterBar
				search={search}
				onSearchChange={setSearch}
				tipo={tipo}
				onTipoChange={setTipo}
				categoriaId={categoriaId}
				onCategoriaChange={setCategoriaId}
				categorias={categorias}
				ordenarPor={ordenarPor}
				onOrdenarChange={setOrdenarPor}
			/>

			{isFirstLoad ? (
				<ProductsSkeleton />
			) : !errorMessage && anuncios.length === 0 ? (
				<EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
			) : anuncios.length > 0 ? (
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{anuncios.map((anuncio) => (
						<ProductCard key={anuncio.id} anuncio={anuncio} />
					))}
					{isLoading && Array.from({ length: 4 }).map((_, index) => (
						<ProductCardSkeleton key={`loading-${index}`} />
					))}
				</div>
			) : null}

			{errorMessage && (
				<div role='alert' className='flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center sm:flex-row sm:justify-center'>
					<p className='text-sm text-muted-foreground'>{errorMessage}</p>
					<Button
						type='button'
						variant='outline'
						onClick={() => void fetchAnuncios(filtros, anuncios.length === 0)}
					>
						<RefreshCw className='size-4' />
						Tentar novamente
					</Button>
				</div>
			)}

			<div ref={loadMoreRef} className='flex h-10 items-center justify-center' aria-hidden={!isLoading}>
				{isLoading && anuncios.length > 0 && (
					<LoaderCircle className='size-5 animate-spin text-muted-foreground' />
				)}
			</div>
		</div>
	)
}

function ProductsSkeleton() {
	return (
		<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{Array.from({ length: 8 }).map((_, index) => (
				<ProductCardSkeleton key={index} />
			))}
		</div>
	)
}
