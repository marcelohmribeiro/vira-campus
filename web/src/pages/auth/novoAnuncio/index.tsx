import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Leaf, PackagePlus, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AnuncioForm } from 'src/components'
import { Button } from 'src/components/ui'
import { getApiErrorMessage } from 'src/lib/apiErrors'
import { criarAnuncio, listarCategorias } from 'src/services'
import type { AnuncioFormValues, Categoria } from 'src/types'

export default function NovoAnuncio() {
	const navigate = useNavigate()
	const [categorias, setCategorias] = useState<Categoria[]>([])
	const [isLoadingCategorias, setIsLoadingCategorias] = useState(true)
	const [categoriasError, setCategoriasError] = useState('')

	const carregarCategorias = useCallback(async () => {
		try {
			setIsLoadingCategorias(true)
			setCategoriasError('')
			setCategorias(await listarCategorias())
		} catch {
			setCategoriasError('Não foi possível carregar as categorias.')
		} finally {
			setIsLoadingCategorias(false)
		}
	}, [])

	useEffect(() => {
		void carregarCategorias()
	}, [carregarCategorias])

	async function handleCreate(values: AnuncioFormValues) {
		try {
			await criarAnuncio(values)
			toast.success('Anúncio publicado com sucesso!', {
				description: 'Seu item já está disponível para a comunidade do campus.',
			})
			navigate('/auth/explorar')
		} catch (error) {
			throw new Error(
				getApiErrorMessage(
					error,
					'Não foi possível publicar o anúncio. Tente novamente em instantes.',
				),
			)
		}
	}

	return (
		<div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
			<div>
				<Button
					type='button'
					variant='ghost'
					onClick={() => navigate('/auth/explorar')}
					className='-ml-2 mb-3 h-8 rounded-lg px-2 text-muted-foreground hover:text-foreground'
				>
					<ArrowLeft className='size-4' />
					Voltar para anúncios
				</Button>

				<div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
					<div className='flex items-start gap-3.5'>
						<span className='mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[0_8px_20px_rgba(182,239,103,0.28)]'>
							<PackagePlus className='size-5' strokeWidth={2.2} />
						</span>
						<div>
							<h1 className='text-2xl font-semibold tracking-[-0.035em] text-foreground'>
								Criar novo anúncio
							</h1>
							<p className='mt-1 max-w-xl text-sm leading-6 text-muted-foreground'>
								Dê um novo destino ao que você não usa mais. Leva só alguns minutos.
							</p>
						</div>
					</div>

					<div className='hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex'>
						<Leaf className='size-3.5 text-[#4f7c61]' />
						Economia circular começa aqui
					</div>
				</div>
			</div>

			<AnuncioForm
				categorias={categorias}
				isLoadingCategorias={isLoadingCategorias}
				categoriasError={categoriasError}
				onRetryCategorias={() => void carregarCategorias()}
				onSubmit={handleCreate}
				onCancel={() => navigate('/auth/explorar')}
			/>

			<div className='flex items-start justify-center gap-2 pb-2 text-center text-xs leading-5 text-muted-foreground'>
				<ShieldCheck className='mt-0.5 size-3.5 shrink-0 text-[#4f7c61]' />
				<span>Publique apenas itens permitidos e descreva o estado do produto com transparência.</span>
			</div>
		</div>
	)
}
