import { useMemo, useState } from 'react'
import { Archive, PackagePlus, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { DeleteAnuncioDialog, MeuAnuncioCard, MeuAnuncioCardSkeleton, RequestErrorState } from 'src/components'
import { Button } from 'src/components/ui'
import { useMeusAnuncios } from 'src/hooks/useMeusAnuncios'
import { getApiErrorMessage } from 'src/lib/apiErrors'
import { cn } from 'src/lib/utils'
import { removerAnuncio } from 'src/services'
import type { Anuncio, StatusAnuncio } from 'src/types'

type StatusFilter = 'TODOS' | StatusAnuncio

const statusFilters: { value: StatusFilter; label: string }[] = [
	{ value: 'TODOS', label: 'Todos' },
	{ value: 'ATIVO', label: 'Disponíveis' },
	{ value: 'RESERVADO', label: 'Reservados' },
	{ value: 'CONCLUIDO', label: 'Concluídos' },
]

export default function MeusAnuncios() {
	const { anuncios, errorMessage, isLoading, reload, removeFromList } = useMeusAnuncios()
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('TODOS')
	const [anuncioToDelete, setAnuncioToDelete] = useState<Anuncio | null>(null)
	const [deleteError, setDeleteError] = useState('')
	const [isDeleting, setIsDeleting] = useState(false)

	const filteredAnuncios = useMemo(() => {
		if (statusFilter === 'TODOS') return anuncios
		return anuncios.filter((anuncio) => anuncio.status === statusFilter)
	}, [anuncios, statusFilter])

	function openDeleteDialog(anuncio: Anuncio) {
		setDeleteError('')
		setAnuncioToDelete(anuncio)
	}

	function handleDialogOpenChange(open: boolean) {
		if (!open) {
			setAnuncioToDelete(null)
			setDeleteError('')
		}
	}

	async function handleDelete() {
		if (!anuncioToDelete) return

		try {
			setIsDeleting(true)
			setDeleteError('')
			await removerAnuncio(anuncioToDelete.id)
			removeFromList(anuncioToDelete.id)
			setAnuncioToDelete(null)
			toast.success('Anúncio excluído com sucesso.')
		} catch (error) {
			setDeleteError(
				getApiErrorMessage(error, 'Não foi possível excluir o anúncio. Tente novamente.'),
			)
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<div className='mx-auto flex w-full max-w-5xl flex-col gap-6'>
			<PageHeader total={anuncios.length} />

			{!isLoading && !errorMessage && anuncios.length > 0 && (
				<StatusFilters value={statusFilter} onChange={setStatusFilter} />
			)}

			{isLoading ? (
				<LoadingList />
			) : errorMessage ? (
				<RequestErrorState
					title='Não foi possível abrir seu histórico'
					message={errorMessage}
					onRetry={reload}
				/>
			) : anuncios.length === 0 ? (
				<EmptyHistory />
			) : filteredAnuncios.length === 0 ? (
				<EmptyFilter onClear={() => setStatusFilter('TODOS')} />
			) : (
				<div className='space-y-4'>
					{filteredAnuncios.map((anuncio) => (
						<MeuAnuncioCard
							key={anuncio.id}
							anuncio={anuncio}
							onDelete={openDeleteDialog}
							isDeleting={isDeleting && anuncioToDelete?.id === anuncio.id}
						/>
					))}
				</div>
			)}

			<DeleteAnuncioDialog
				anuncio={anuncioToDelete}
				open={Boolean(anuncioToDelete)}
				onOpenChange={handleDialogOpenChange}
				onConfirm={handleDelete}
				isDeleting={isDeleting}
				errorMessage={deleteError}
			/>
		</div>
	)
}

function PageHeader({ total }: { total: number }) {
	return (
		<header className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
			<div className='flex items-start gap-3.5'>
				<span className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground'>
					<Archive className='size-5' />
				</span>
				<div>
					<h1 className='text-2xl font-semibold tracking-[-0.035em] text-foreground'>Meus anúncios</h1>
					<p className='mt-1 text-sm leading-6 text-muted-foreground'>
						{total === 0
							? 'Acompanhe os produtos que você publicar.'
							: `${total} ${total === 1 ? 'anúncio' : 'anúncios'} no seu histórico.`}
					</p>
				</div>
			</div>

			<Button asChild className='h-11 w-full rounded-xl px-4 font-semibold sm:w-auto'>
				<Link to='/auth/anuncios/novo'>
					<Plus className='size-4' />
					Novo anúncio
				</Link>
			</Button>
		</header>
	)
}

interface StatusFiltersProps {
	value: StatusFilter
	onChange: (value: StatusFilter) => void
}

function StatusFilters({ value, onChange }: StatusFiltersProps) {
	return (
		<div
			role='group'
			aria-label='Filtrar anúncios por status'
			className='flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1.5'
		>
			{statusFilters.map((filter) => (
				<button
					key={filter.value}
					type='button'
					onClick={() => onChange(filter.value)}
					aria-pressed={value === filter.value}
					className={cn(
						'h-11 flex-none rounded-xl px-3.5 text-xs font-semibold transition-colors sm:flex-1',
						value === filter.value
							? 'bg-primary text-primary-foreground shadow-sm'
							: 'text-muted-foreground hover:bg-muted hover:text-foreground',
					)}
				>
					{filter.label}
				</button>
			))}
		</div>
	)
}

function LoadingList() {
	return (
		<div aria-label='Carregando seus anúncios' className='space-y-4'>
			{Array.from({ length: 3 }).map((_, index) => (
				<MeuAnuncioCardSkeleton key={index} />
			))}
		</div>
	)
}

function EmptyHistory() {
	return (
		<div className='flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center'>
			<span className='flex size-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground'>
				<PackagePlus className='size-7' />
			</span>
			<h2 className='mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground'>Seu histórico está vazio</h2>
			<p className='mt-2 max-w-sm text-sm leading-6 text-muted-foreground'>
				Publique seu primeiro produto e ajude a movimentar a economia circular no campus.
			</p>
			<Button asChild className='mt-6 h-11 rounded-xl px-4'>
				<Link to='/auth/anuncios/novo'>Criar primeiro anúncio</Link>
			</Button>
		</div>
	)
}

function EmptyFilter({ onClear }: { onClear: () => void }) {
	return (
		<div className='rounded-3xl border border-border bg-card px-6 py-10 text-center'>
			<p className='text-sm font-medium text-foreground'>Nenhum anúncio com este status.</p>
			<Button type='button' variant='ghost' onClick={onClear} className='mt-3 h-10 rounded-xl'>
				Mostrar todos
			</Button>
		</div>
	)
}
