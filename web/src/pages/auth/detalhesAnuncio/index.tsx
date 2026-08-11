import { useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AnuncioDetails, AnuncioDetailsSkeleton, RequestErrorState } from 'src/components'
import { Button } from 'src/components/ui'
import { getApiErrorMessage } from 'src/lib/apiErrors'
import { buscarAnuncio, reservarAnuncio } from 'src/services'
import useAuthStore from 'src/store/authStore'
import { useAnunciosStore } from 'src/store/fetchAnuncios'
import type { Anuncio } from 'src/types'

function getLoadErrorMessage(error: unknown) {
	if (isAxiosError(error) && error.response?.status === 404) {
		return 'Este anúncio não existe ou foi removido.'
	}

	if (isAxiosError(error) && error.code === 'ERR_NETWORK') {
		return 'Não foi possível conectar ao servidor.'
	}

	return getApiErrorMessage(error, 'Não foi possível carregar os detalhes deste anúncio.')
}

export default function DetalhesAnuncio() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const userId = useAuthStore((state) => state.user?.id)
	const [anuncio, setAnuncio] = useState<Anuncio | null>(null)
	const [errorMessage, setErrorMessage] = useState('')
	const [reservationError, setReservationError] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isReserving, setIsReserving] = useState(false)
	const [reloadCount, setReloadCount] = useState(0)
	const isMounted = useRef(true)
	const reservationInFlight = useRef(false)

	useEffect(() => {
		isMounted.current = true
		return () => {
			isMounted.current = false
		}
	}, [])

	useEffect(() => {
		const controller = new AbortController()

		async function loadAnuncio() {
			const anuncioId = Number(id)

			if (!Number.isInteger(anuncioId) || anuncioId <= 0) {
				setErrorMessage('O endereço deste anúncio é inválido.')
				setIsLoading(false)
				return
			}

			try {
				setIsLoading(true)
				setErrorMessage('')
				setReservationError('')
				const data = await buscarAnuncio(anuncioId, {
					signal: controller.signal,
				})
				setAnuncio(data)
			} catch (error) {
				if (controller.signal.aborted) return
				setAnuncio(null)
				setErrorMessage(getLoadErrorMessage(error))
			} finally {
				if (!controller.signal.aborted) setIsLoading(false)
			}
		}

		void loadAnuncio()
		return () => controller.abort()
	}, [id, reloadCount])

	async function handleReserve() {
		if (
			!anuncio ||
			anuncio.status !== 'ATIVO' ||
			anuncio.usuarioId === userId ||
			reservationInFlight.current
		) {
			return
		}

		reservationInFlight.current = true
		setIsReserving(true)
		setReservationError('')

		try {
			const anuncioReservado = await reservarAnuncio(anuncio.id)
			if (!isMounted.current) return

			setAnuncio(anuncioReservado)
			useAnunciosStore.getState().removeItem(anuncioReservado.id)
			toast.success('Produto reservado com sucesso.')
		} catch (error) {
			if (!isMounted.current) return

			setReservationError(
				getApiErrorMessage(error, 'Não foi possível reservar este produto.'),
			)

			if (isAxiosError(error) && error.response?.status === 409) {
				try {
					const anuncioAtual = await buscarAnuncio(anuncio.id)
					if (!isMounted.current) return

					setAnuncio(anuncioAtual)
					if (anuncioAtual.status !== 'ATIVO') {
						useAnunciosStore.getState().removeItem(anuncioAtual.id)
					}
				} catch {
					// Mantém a mensagem original da tentativa de reserva.
				}
			}
		} finally {
			reservationInFlight.current = false
			if (isMounted.current) setIsReserving(false)
		}
	}

	return (
		<div className='mx-auto flex w-full max-w-6xl flex-col gap-5'>
			<Button
				type='button'
				variant='ghost'
				onClick={() => navigate(-1)}
				className='-ml-2 w-fit rounded-lg px-2 text-muted-foreground hover:text-foreground'
			>
				<ArrowLeft className='size-4' />
				Voltar para anúncios
			</Button>

			{isLoading ? (
				<AnuncioDetailsSkeleton />
			) : errorMessage ? (
				<RequestErrorState
					title='Anúncio indisponível'
					message={errorMessage}
					onRetry={() => setReloadCount((count) => count + 1)}
				/>
			) : anuncio ? (
				<AnuncioDetails
					anuncio={anuncio}
					isOwner={anuncio.usuarioId === userId}
					isReserving={isReserving}
					reservationError={reservationError}
					onReserve={handleReserve}
				/>
			) : null}
		</div>
	)
}
