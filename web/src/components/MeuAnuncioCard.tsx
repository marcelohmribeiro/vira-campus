import { CalendarDays, Eye, Gift, ImageOff, LoaderCircle, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AnuncioStatusBadge } from 'src/components/AnuncioStatusBadge'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import { formatDate, formatPrice } from 'src/lib/formatters'
import type { Anuncio } from 'src/types'

interface MeuAnuncioCardProps {
	anuncio: Anuncio
	onDelete: (anuncio: Anuncio) => void
	isDeleting?: boolean
}

export function MeuAnuncioCard({ anuncio, onDelete, isDeleting = false }: MeuAnuncioCardProps) {
	return (
		<article className='overflow-hidden rounded-2xl border border-border bg-card shadow-[0_10px_28px_rgba(23,59,50,0.05)] sm:grid sm:grid-cols-[12rem_minmax(0,1fr)]'>
			<AnuncioImage anuncio={anuncio} />

			<div className='flex min-w-0 flex-col p-4 sm:p-5'>
				<div className='flex flex-wrap items-center justify-between gap-2'>
					<Badge variant='outline'>{anuncio.categoria?.nome ?? 'Sem categoria'}</Badge>
					<time
						dateTime={anuncio.createdAt}
						className='flex items-center gap-1.5 text-xs text-muted-foreground'
					>
						<CalendarDays className='size-3.5' aria-hidden='true' />
						{formatDate(anuncio.createdAt)}
					</time>
				</div>

				<h2 className='mt-3 line-clamp-2 text-lg leading-6 font-semibold tracking-[-0.02em] text-foreground'>
					{anuncio.titulo}
				</h2>

				<AnuncioPrice anuncio={anuncio} />

				<p className='mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground'>
					{anuncio.descricao}
				</p>

				<AnuncioActions anuncio={anuncio} onDelete={onDelete} isDeleting={isDeleting} />
			</div>
		</article>
	)
}

function AnuncioImage({ anuncio }: { anuncio: Anuncio }) {
	return (
		<div className='relative aspect-16/10 min-h-44 overflow-hidden bg-muted sm:aspect-auto sm:min-h-full'>
			{anuncio.imagemUrl ? (
				<img
					src={anuncio.imagemUrl}
					alt={`Foto de ${anuncio.titulo}`}
					loading='lazy'
					className='size-full object-cover'
				/>
			) : (
				<div className='flex size-full flex-col items-center justify-center gap-2 text-muted-foreground'>
					<ImageOff className='size-7' aria-hidden='true' />
					<span className='text-xs'>Sem imagem</span>
				</div>
			)}

			<AnuncioStatusBadge
				status={anuncio.status}
				className='absolute top-3 left-3 h-7 border px-3 shadow-sm backdrop-blur-sm'
			/>
		</div>
	)
}

function AnuncioPrice({ anuncio }: { anuncio: Anuncio }) {
	if (anuncio.tipo === 'DOACAO') {
		return (
			<p className='mt-2 flex items-center gap-1.5 font-semibold text-secondary-foreground'>
				<Gift className='size-4' aria-hidden='true' />
				Doação
			</p>
		)
	}

	return (
		<p className='mt-2 text-xl font-bold tracking-[-0.025em] text-foreground'>
			{anuncio.preco === null ? 'Preço não informado' : formatPrice(anuncio.preco)}
		</p>
	)
}

function AnuncioActions({ anuncio, onDelete, isDeleting }: MeuAnuncioCardProps) {
	return (
		<div className='mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4 sm:flex'>
			<Button asChild variant='outline' className='h-11 min-w-0 flex-1 rounded-xl'>
				<Link to={`/auth/anuncios/${anuncio.id}`} aria-label={`Visualizar ${anuncio.titulo}`}>
					<Eye aria-hidden='true' />
					Visualizar
				</Link>
			</Button>

			<Button asChild variant='secondary' className='h-11 min-w-0 flex-1 rounded-xl'>
				<Link to={`/auth/meus-anuncios/${anuncio.id}/editar`} aria-label={`Editar ${anuncio.titulo}`}>
					<Pencil aria-hidden='true' />
					Editar
				</Link>
			</Button>

			<Button
				type='button'
				variant='destructive'
				disabled={isDeleting}
				onClick={() => onDelete(anuncio)}
				aria-label={`Excluir ${anuncio.titulo}`}
				className='col-span-2 h-11 rounded-xl sm:flex-1'
			>
				{isDeleting ? (
					<LoaderCircle className='animate-spin' aria-hidden='true' />
				) : (
					<Trash2 aria-hidden='true' />
				)}
				{isDeleting ? 'Excluindo...' : 'Excluir'}
			</Button>
		</div>
	)
}
