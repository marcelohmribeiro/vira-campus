import { Link } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import { AnuncioStatusLabel } from 'src/components/AnuncioStatusBadge'
import { ImageWithFallback } from 'src/components/ImageWithFallback'
import { Badge } from 'src/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
import { formatPrice, formatRelativeDate, getInitials } from 'src/lib/formatters'
import { cn } from 'src/lib/utils'
import type { Anuncio } from 'src/types'

interface ProductCardProps {
	anuncio: Anuncio
}

export function ProductCard({ anuncio }: ProductCardProps) {
	const isIndisponivel = anuncio.status !== 'ATIVO'

	return (
		<Link
			to={`/auth/anuncios/${anuncio.id}`}
			className={cn(
				'group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(23,59,50,0.1)]',
				isIndisponivel && 'opacity-75'
			)}
		>
			<div className='relative aspect-4/3 w-full overflow-hidden bg-muted'>
				<ImageWithFallback
					src={anuncio.imagemUrl}
					alt={anuncio.titulo}
					loading='lazy'
					className='size-full object-cover transition-transform duration-300 group-hover:scale-105'
					fallback={
						<div className='flex size-full items-center justify-center text-[#9aa7a3]'>
							<ImageOff className='size-8' />
						</div>
					}
				/>

				<Badge className='absolute top-3 left-3 border-0 bg-white/90 text-foreground shadow-sm backdrop-blur'>
					{anuncio.categoria?.nome}
				</Badge>

				{isIndisponivel && (
					<div className='absolute inset-0 flex items-center justify-center bg-primary/45'>
						<span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-foreground'>
							<AnuncioStatusLabel status={anuncio.status} />
						</span>
					</div>
				)}
			</div>

			<div className='flex flex-1 flex-col gap-2 p-4'>
				<h3 className='line-clamp-2 text-sm leading-5 font-semibold text-foreground'>{anuncio.titulo}</h3>

				{anuncio.tipo === 'DOACAO' ? (
					<Badge className='w-fit border-0 bg-secondary text-secondary-foreground hover:bg-secondary'>Doação</Badge>
				) : (
					<span className='text-lg font-bold tracking-[-0.02em] text-foreground'>{formatPrice(anuncio.preco)}</span>
				)}

				<div className='mt-auto flex items-center justify-between gap-2 pt-3'>
					<div className='flex min-w-0 items-center gap-2'>
						<Avatar className='size-6'>
							<AvatarImage src={anuncio.usuario?.fotoPerfilUrl} alt={anuncio.usuario?.nome} />
							<AvatarFallback className='bg-secondary text-[10px] font-semibold text-secondary-foreground'>
								{getInitials(anuncio.usuario?.nome)}
							</AvatarFallback>
						</Avatar>
						<span className='truncate text-xs text-muted-foreground'>{anuncio.usuario?.nome}</span>
					</div>
					<span className='shrink-0 text-xs text-[#9aa7a3]'>{formatRelativeDate(anuncio.createdAt)}</span>
				</div>
			</div>
		</Link>
	)
}
