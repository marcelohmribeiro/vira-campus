import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from 'src/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from 'src/components/ui/select'
import { cn } from 'src/lib/utils'
import type { Categoria, TipoAnuncio } from 'src/types'

export type TipoFiltro = 'TODOS' | TipoAnuncio
export type OrdenarPor = 'recentes' | 'menor-preco' | 'maior-preco'

interface FilterBarProps {
	search: string
	onSearchChange: (value: string) => void
	tipo: TipoFiltro
	onTipoChange: (value: TipoFiltro) => void
	categoriaId: string
	onCategoriaChange: (value: string) => void
	categorias: Categoria[]
	ordenarPor: OrdenarPor
	onOrdenarChange: (value: OrdenarPor) => void
}

const tipos: { value: TipoFiltro; label: string }[] = [
	{ value: 'TODOS', label: 'Todos' },
	{ value: 'VENDA', label: 'À venda' },
	{ value: 'DOACAO', label: 'Doação' },
]

export function FilterBar({
	search,
	onSearchChange,
	tipo,
	onTipoChange,
	categoriaId,
	onCategoriaChange,
	categorias,
	ordenarPor,
	onOrdenarChange,
}: FilterBarProps) {
	return (
		<div className='flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center'>
			<div className='relative flex-1'>
				<Search className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a9a95]' />
				<Input
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder='Buscar por livros, eletrônicos, móveis...'
					className='h-10 rounded-xl border-border bg-[#fbfcf9] pl-9 text-sm text-foreground placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15'
				/>
			</div>

			<div className='flex shrink-0 items-center gap-1 rounded-xl bg-muted p-1'>
				{tipos.map((item) => (
					<button
						key={item.value}
						type='button'
						onClick={() => onTipoChange(item.value)}
						className={cn(
							'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
							tipo === item.value ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
						)}
					>
						{item.label}
					</button>
				))}
			</div>

			<Select value={categoriaId} onValueChange={onCategoriaChange}>
				<SelectTrigger className='h-10 w-full rounded-xl border-border bg-[#fbfcf9] text-sm text-foreground sm:w-44'>
					<SelectValue placeholder='Categoria' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='TODAS'>Todas as categorias</SelectItem>
					{categorias.map((categoria) => (
						<SelectItem key={categoria.id} value={String(categoria.id)}>
							{categoria.nome}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select value={ordenarPor} onValueChange={onOrdenarChange}>
				<SelectTrigger className='h-10 w-full rounded-xl border-border bg-[#fbfcf9] text-sm text-foreground sm:w-44'>
					<SlidersHorizontal className='size-3.5 text-[#8a9a95]' />
					<SelectValue placeholder='Ordenar por' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='recentes'>Mais recentes</SelectItem>
					<SelectItem value='menor-preco'>Menor preço</SelectItem>
					<SelectItem value='maior-preco'>Maior preço</SelectItem>
				</SelectContent>
			</Select>
		</div>
	)
}