import { useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { ArrowLeft, PencilLine } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AnuncioForm, type AnuncioFormInitialValues, RequestErrorState } from 'src/components'
import { Button, Skeleton } from 'src/components/ui'
import { getApiErrorMessage } from 'src/lib/apiErrors'
import { buscarAnuncio, editarAnuncio, listarCategorias } from 'src/services'
import useAuthStore from 'src/store/authStore'
import type { Anuncio, AnuncioFormValues, Categoria } from 'src/types'

interface EditPageData {
	anuncio: Anuncio
	categorias: Categoria[]
}

function getLoadErrorMessage(error: unknown) {
	if (isAxiosError(error) && error.response?.status === 404) {
		return 'Este anúncio não existe ou foi removido.'
	}

	return getApiErrorMessage(error, 'Não foi possível carregar o anúncio para edição.')
}

export default function EditarAnuncio() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const userId = useAuthStore((state) => state.user?.id)
	const [pageData, setPageData] = useState<EditPageData | null>(null)
	const [errorMessage, setErrorMessage] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [reloadCount, setReloadCount] = useState(0)
	const isMounted = useRef(true)

	useEffect(() => {
		isMounted.current = true
		return () => {
			isMounted.current = false
		}
	}, [])

	useEffect(() => {
		const controller = new AbortController()

		async function loadPage() {
			const anuncioId = Number(id)

			if (!Number.isInteger(anuncioId) || anuncioId <= 0) {
				setErrorMessage('O endereço deste anúncio é inválido.')
				setIsLoading(false)
				return
			}

			try {
				setIsLoading(true)
				setErrorMessage('')

				const [anuncio, categorias] = await Promise.all([
					buscarAnuncio(anuncioId, { signal: controller.signal }),
					listarCategorias(controller.signal),
				])

				if (userId && anuncio.usuarioId !== userId) {
					setErrorMessage('Você não tem permissão para editar este anúncio.')
					return
				}

				setPageData({ anuncio, categorias })
			} catch (error) {
				if (controller.signal.aborted) return
				setPageData(null)
				setErrorMessage(getLoadErrorMessage(error))
			} finally {
				if (!controller.signal.aborted) setIsLoading(false)
			}
		}

		void loadPage()
		return () => controller.abort()
	}, [id, reloadCount, userId])

	async function handleUpdate(values: AnuncioFormValues) {
		if (!pageData) return

		try {
			await editarAnuncio(pageData.anuncio.id, values)
			if (!isMounted.current) return

			toast.success('Anúncio atualizado com sucesso!')
			navigate('/auth/meus-anuncios')
		} catch (error) {
			if (!isMounted.current) return

			throw new Error(
				getApiErrorMessage(error, 'Não foi possível salvar as alterações. Tente novamente.'),
			)
		}
	}

	const initialValues: AnuncioFormInitialValues | undefined = pageData
		? {
				titulo: pageData.anuncio.titulo,
				descricao: pageData.anuncio.descricao,
				tipo: pageData.anuncio.tipo,
				preco: pageData.anuncio.preco,
				categoriaId: pageData.anuncio.categoriaId,
				imagemUrl: pageData.anuncio.imagemUrl,
			}
		: undefined

	return (
		<div className='mx-auto flex w-full max-w-6xl flex-col gap-5'>
			<PageHeader onBack={() => navigate('/auth/meus-anuncios')} />

			{isLoading ? (
				<EditFormSkeleton />
			) : errorMessage ? (
				<RequestErrorState
					title='Não foi possível editar'
					message={errorMessage}
					onRetry={() => setReloadCount((count) => count + 1)}
				/>
			) : pageData && initialValues ? (
				<AnuncioForm
					key={pageData.anuncio.id}
					mode='edit'
					initialValues={initialValues}
					categorias={pageData.categorias}
					onSubmit={handleUpdate}
					onCancel={() => navigate('/auth/meus-anuncios')}
				/>
			) : null}
		</div>
	)
}

function PageHeader({ onBack }: { onBack: () => void }) {
	return (
		<header>
			<Button
				type='button'
				variant='ghost'
				onClick={onBack}
				className='-ml-2 mb-3 w-fit rounded-lg px-2 text-muted-foreground hover:text-foreground'
			>
				<ArrowLeft className='size-4' />
				Voltar para meus anúncios
			</Button>
			<div className='flex items-start gap-3.5'>
				<span className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground'>
					<PencilLine className='size-5' />
				</span>
				<div>
					<h1 className='text-2xl font-semibold tracking-[-0.035em] text-foreground'>Editar anúncio</h1>
					<p className='mt-1 text-sm leading-6 text-muted-foreground'>Atualize a foto ou os detalhes do seu produto.</p>
				</div>
			</div>
		</header>
	)
}

function EditFormSkeleton() {
	return (
		<div role='status' aria-busy='true' className='grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-[0.82fr_1.35fr]'>
			<span className='sr-only'>Carregando formulário de edição...</span>
			<div className='border-b border-border bg-muted/35 p-5 lg:border-r lg:border-b-0 lg:p-7'>
				<Skeleton className='h-6 w-40' />
				<Skeleton className='mt-5 aspect-video w-full rounded-2xl' />
			</div>
			<div className='space-y-5 p-5 lg:p-7'>
				<Skeleton className='h-20 w-full rounded-xl' />
				<Skeleton className='h-11 w-full rounded-xl' />
				<div className='grid gap-5 sm:grid-cols-2'>
					<Skeleton className='h-11 w-full rounded-xl' />
					<Skeleton className='h-11 w-full rounded-xl' />
				</div>
				<Skeleton className='h-32 w-full rounded-xl' />
			</div>
		</div>
	)
}
