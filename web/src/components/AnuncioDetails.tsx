import {
	Bookmark,
	CalendarDays,
	Gift,
	ImageOff,
	LoaderCircle,
	Package,
	ShieldCheck,
	Tag,
} from 'lucide-react'

import { AnuncioStatusBadge } from 'src/components/AnuncioStatusBadge'
import { ImageWithFallback } from 'src/components/ImageWithFallback'
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
import { Badge } from 'src/components/ui/badge'
import { Button } from 'src/components/ui/button'
import { formatDate, formatPrice, formatRelativeDate, getInitials } from 'src/lib/formatters'
import type { Anunciante, Anuncio, StatusAnuncio } from 'src/types'

interface AnuncioDetailsProps {
	anuncio: Anuncio
	isOwner: boolean
	isReserving: boolean
	reservationError?: string
	onReserve: () => void
}

export function AnuncioDetails({
	anuncio,
	isOwner,
	isReserving,
	reservationError,
	onReserve,
}: AnuncioDetailsProps) {
	return (
		<article className='grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)] lg:items-start'>
			<AnuncioImage anuncio={anuncio} />

			<section aria-label='Resumo do anúncio' className='lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2'>
				<AnuncioSummary
					anuncio={anuncio}
					isOwner={isOwner}
					isReserving={isReserving}
					reservationError={reservationError}
					onReserve={onReserve}
				/>
			</section>

			<div className='space-y-5 lg:col-start-1 lg:row-start-2'>
				<DescriptionSection description={anuncio.descricao} />
				<SafetyTip />
			</div>
		</article>
	)
}

function AnuncioSummary({
	anuncio,
	isOwner,
	isReserving,
	reservationError,
	onReserve,
}: AnuncioDetailsProps) {
	const isDonation = anuncio.tipo === 'DOACAO'

	return (
		<div className='rounded-3xl border border-border bg-card p-5 shadow-[0_18px_45px_rgba(23,59,50,0.07)] sm:p-6'>
			<div className='flex flex-wrap items-center gap-2'>
				<Badge variant='outline' className='h-7 gap-1.5 rounded-full px-3'>
					<Tag className='size-3.5' />
					{anuncio.categoria?.nome ?? 'Sem categoria'}
				</Badge>
				<Badge variant='secondary' className='h-7 rounded-full px-3'>
					{isDonation ? 'Doação' : 'Venda'}
				</Badge>
				<AnuncioStatusBadge
					status={anuncio.status}
					className='h-7 rounded-full px-3'
				/>
			</div>

			<h1 className='mt-5 text-2xl leading-tight font-semibold tracking-[-0.035em] text-foreground sm:text-3xl'>
				{anuncio.titulo}
			</h1>

			<div className='mt-4'>
				{isDonation ? (
					<>
						<p className='flex items-center gap-2 text-2xl font-bold tracking-[-0.03em] text-foreground'>
							<Gift className='size-5 text-[#4f7c61]' />
							Doação
						</p>
						<p className='mt-1 text-sm text-muted-foreground'>Este item é oferecido gratuitamente.</p>
					</>
				) : (
					<p className='text-3xl font-bold tracking-[-0.04em] text-foreground'>
						{anuncio.preco === null ? 'Preço não informado' : formatPrice(anuncio.preco)}
					</p>
				)}
			</div>

			<div className='mt-5 flex items-center gap-2 border-y border-border py-4 text-sm text-muted-foreground'>
				<CalendarDays className='size-4 shrink-0 text-[#4f7c61]' />
				<time dateTime={anuncio.createdAt} title={formatDate(anuncio.createdAt)}>
					Publicado {formatRelativeDate(anuncio.createdAt)}
				</time>
			</div>

			<SellerCard seller={anuncio.usuario} />
			<ReservationAction
				status={anuncio.status}
				isOwner={isOwner}
				isReserving={isReserving}
				errorMessage={reservationError}
				onReserve={onReserve}
			/>
		</div>
	)
}

function DescriptionSection({ description }: { description: string }) {
	return (
		<section aria-labelledby='descricao-title' className='rounded-3xl border border-border bg-card p-5 sm:p-6'>
			<div className='mb-4 flex items-center gap-2.5'>
				<span className='flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground'>
					<Package className='size-4.5' />
				</span>
				<h2 id='descricao-title' className='text-lg font-semibold tracking-[-0.02em] text-foreground'>
					Descrição do item
				</h2>
			</div>
			<p className='whitespace-pre-wrap text-sm leading-7 text-[#405a53] sm:text-base'>{description}</p>
		</section>
	)
}

function SafetyTip() {
	return (
		<section className='flex gap-3 rounded-2xl border border-[#d7e8c0] bg-secondary/55 p-4'>
			<ShieldCheck className='mt-0.5 size-5 shrink-0 text-[#3f6d52]' />
			<div>
				<h2 className='text-sm font-semibold text-foreground'>Troque com segurança</h2>
				<p className='mt-1 text-xs leading-5 text-muted-foreground'>
					Confira o estado do item e combine a entrega em um local movimentado do campus.
				</p>
			</div>
		</section>
	)
}

function AnuncioImage({ anuncio }: { anuncio: Anuncio }) {
	return (
		<div className='overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_45px_rgba(23,59,50,0.06)] lg:col-start-1 lg:row-start-1'>
			<div className='aspect-4/3 w-full bg-muted'>
				<ImageWithFallback
					src={anuncio.imagemUrl}
					alt={`Foto do produto: ${anuncio.titulo}`}
					className='size-full object-cover'
					fallback={
						<div className='flex size-full flex-col items-center justify-center gap-3 text-muted-foreground'>
							<ImageOff className='size-10' />
							<span className='text-sm'>Imagem não disponível</span>
						</div>
					}
				/>
			</div>
		</div>
	)
}

function SellerCard({ seller }: { seller?: Anunciante }) {
	const sellerName = seller?.nome ?? 'Estudante do campus'

	return (
		<section aria-labelledby='anunciante-title' className='pt-5'>
			<p id='anunciante-title' className='text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase'>
				Anunciado por
			</p>
			<div className='mt-3 flex items-center gap-3'>
				<Avatar className='size-11 ring-1 ring-border'>
					<AvatarImage src={seller?.fotoPerfilUrl ?? undefined} alt={sellerName} />
					<AvatarFallback className='bg-secondary text-sm font-semibold text-secondary-foreground'>
						{getInitials(sellerName)}
					</AvatarFallback>
				</Avatar>
				<div className='min-w-0'>
					<p className='truncate text-sm font-semibold text-foreground'>{sellerName}</p>
				</div>
			</div>
		</section>
	)
}

interface ReservationActionProps {
	status: StatusAnuncio
	isOwner: boolean
	isReserving: boolean
	errorMessage?: string
	onReserve: () => void
}

function getReservationCopy(
	status: StatusAnuncio,
	isOwner: boolean,
	isReserving: boolean,
) {
	if (isReserving) {
		return {
			button: 'Reservando...',
			help: 'Confirmando a disponibilidade deste item.',
		}
	}

	if (isOwner && status === 'ATIVO') {
		return {
			button: 'Este anúncio é seu',
			help: 'Você não pode reservar um item publicado por você.',
		}
	}

	if (status === 'RESERVADO') {
		return {
			button: 'Item reservado',
			help: 'Este item já foi reservado.',
		}
	}

	if (status === 'CONCLUIDO') {
		return {
			button: 'Negociação concluída',
			help: 'Este anúncio não está disponível para reserva.',
		}
	}

	return {
		button: 'Reservar item',
		help: 'Ao reservar, o item ficará indisponível para outros estudantes.',
	}
}

function ReservationAction({
	status,
	isOwner,
	isReserving,
	errorMessage,
	onReserve,
}: ReservationActionProps) {
	const isAvailable = status === 'ATIVO'
	const canReserve = isAvailable && !isOwner
	const copy = getReservationCopy(status, isOwner, isReserving)

	return (
		<div className='mt-6'>
			<Button
				type='button'
				disabled={!canReserve || isReserving}
				onClick={onReserve}
				aria-busy={isReserving}
				aria-describedby='reservation-help'
				className='h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(23,59,50,0.18)] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:shadow-none'
			>
				{isReserving ? (
					<LoaderCircle className='size-4.5 animate-spin' />
				) : (
					<Bookmark className='size-4.5' />
				)}
				{copy.button}
			</Button>
			<p id='reservation-help' className='mt-2.5 text-center text-xs leading-5 text-muted-foreground'>
				{copy.help}
			</p>
			{errorMessage && (
				<p role='alert' className='mt-2 text-center text-xs font-medium text-destructive'>
					{errorMessage}
				</p>
			)}
		</div>
	)
}
