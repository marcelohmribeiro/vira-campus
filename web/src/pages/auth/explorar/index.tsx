import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FilterBar, ProductCard, ProductCardSkeleton, EmptyState, TipoFiltro, OrdenarPor } from 'src/components'
import { api } from 'src/services'
import type { Anuncio, Categoria } from 'src/types'

export default function Explorar() {
	const [anuncios, setAnuncios] = useState<Anuncio[]>([])
	const [categorias, setCategorias] = useState<Categoria[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const [search, setSearch] = useState('')
	const [tipo, setTipo] = useState<TipoFiltro>('TODOS')
	const [categoriaId, setCategoriaId] = useState('TODAS')
	const [ordenarPor, setOrdenarPor] = useState<OrdenarPor>('recentes')

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true)
				const [anunciosRes, categoriasRes] = await Promise.all([
					api.get<Anuncio[]>('/anuncios'),
					api.get<Categoria[]>('/categorias'),
				])
				setAnuncios(anunciosRes.data)
				setCategorias(categoriasRes.data)
			} catch {
				toast.error('Não foi possível carregar os anúncios agora.')
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [])

	const hasFilters = search.trim() !== '' || tipo !== 'TODOS' || categoriaId !== 'TODAS'

	function clearFilters() {
		setSearch('')
		setTipo('TODOS')
		setCategoriaId('TODAS')
	}

	const anunciosFiltrados = useMemo(() => {
		let resultado = anuncios.filter((anuncio) => anuncio.status === 'ATIVO')

		if (search.trim()) {
			const termo = search.trim().toLowerCase()
			resultado = resultado.filter((anuncio) => anuncio.titulo.toLowerCase().includes(termo))
		}

		if (tipo !== 'TODOS') {
			resultado = resultado.filter((anuncio) => anuncio.tipo === tipo)
		}

		if (categoriaId !== 'TODAS') {
			resultado = resultado.filter((anuncio) => String(anuncio.categoriaId) === categoriaId)
		}

		if (ordenarPor === 'menor-preco') {
			resultado = [...resultado].sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0))
		} else if (ordenarPor === 'maior-preco') {
			resultado = [...resultado].sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0))
		} else {
			resultado = [...resultado].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
		}

		return resultado
	}, [anuncios, search, tipo, categoriaId, ordenarPor])

	return (
		<div className='mx-auto flex max-w-7xl flex-col gap-6'>
			<div>
				<h1 className='text-2xl font-semibold tracking-[-0.03em] text-foreground'>Explorar anúncios</h1>
				<p className='mt-1 text-sm text-muted-foreground'>
					{isLoading ? 'Carregando anúncios...' : `${anunciosFiltrados.length} item(ns) disponível(is) no seu campus`}
				</p>
			</div>

			<FilterBar
				search={search}
				onSearchChange={setSearch}
				tipo={tipo}
				onTipoChange={setTipo as (value: TipoFiltro) => void}
				categoriaId={categoriaId}
				onCategoriaChange={setCategoriaId}
				categorias={categorias}
				ordenarPor={ordenarPor}
				onOrdenarChange={setOrdenarPor as (value: OrdenarPor) => void}
			/>

			{isLoading ? (
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{Array.from({ length: 8 }).map((_, index) => (
						<ProductCardSkeleton key={index} />
					))}
				</div>
			) : anunciosFiltrados.length === 0 ? (
				<EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
			) : (
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{anunciosFiltrados.map((anuncio) => (
						<ProductCard key={anuncio.id} anuncio={anuncio} />
					))}
				</div>
			)}
		</div>
	)
}
