import { useState, type FormEvent } from 'react'

import type { AnuncioFormValues, Categoria, TipoAnuncio } from 'src/types'
import {
	AnuncioDetailsSection,
	AnuncioFormFooter,
	AnuncioPhotoSection,
} from './AnuncioFormSections'

export interface AnuncioFormInitialValues {
	titulo: string
	descricao: string
	tipo: TipoAnuncio
	preco: number | null
	categoriaId: number
	imagemUrl: string
}

interface AnuncioFormProps {
	categorias: Categoria[]
	mode?: 'create' | 'edit'
	initialValues?: AnuncioFormInitialValues
	isLoadingCategorias?: boolean
	categoriasError?: string
	onRetryCategorias?: () => void
	onSubmit: (values: AnuncioFormValues) => Promise<void>
	onCancel: () => void
}

export interface AnuncioFormDraft {
	titulo: string
	descricao: string
	tipo: TipoAnuncio
	preco: string
	categoriaId: string
	imagem: File | null
}

export type AnuncioFormField = keyof AnuncioFormDraft
export type AnuncioFormErrors = Partial<Record<AnuncioFormField, string>>
export type AnuncioFieldChange = <Field extends AnuncioFormField>(
	field: Field,
	value: AnuncioFormDraft[Field],
) => void

interface FormCopy {
	details: string
	footer: string
	submit: string
	submitting: string
	error: string
}

const formCopy: Record<'create' | 'edit', FormCopy> = {
	create: {
		details: 'Preencha as informações para publicar no campus.',
		footer: 'Você poderá editar as informações depois.',
		submit: 'Publicar anúncio',
		submitting: 'Publicando...',
		error: 'Não foi possível publicar o anúncio. Tente novamente.',
	},
	edit: {
		details: 'Atualize as informações que deseja alterar.',
		footer: 'As alterações aparecerão imediatamente no anúncio.',
		submit: 'Salvar alterações',
		submitting: 'Salvando...',
		error: 'Não foi possível salvar as alterações. Tente novamente.',
	},
}

const emptyForm: AnuncioFormDraft = {
	titulo: '',
	descricao: '',
	tipo: 'VENDA',
	preco: '',
	categoriaId: '',
	imagem: null,
}

const PRICE_PATTERN = /^\d+(?:\.\d{1,2})?$/
const MAX_ANUNCIO_PRICE = 99_999_999.99

function focusFirstInvalidField(formElement: HTMLFormElement) {
	const firstInvalidField = formElement.querySelector<HTMLElement>(
		'[aria-invalid="true"]:not([tabindex="-1"])',
	)

	if (!firstInvalidField) return

	firstInvalidField.focus({ preventScroll: true })
	firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function createInitialForm(initialValues?: AnuncioFormInitialValues): AnuncioFormDraft {
	if (!initialValues) return emptyForm

	return {
		titulo: initialValues.titulo,
		descricao: initialValues.descricao,
		tipo: initialValues.tipo,
		preco: initialValues.preco === null ? '' : String(initialValues.preco),
		categoriaId: String(initialValues.categoriaId),
		imagem: null,
	}
}

function validateForm(form: AnuncioFormDraft, hasCurrentImage: boolean): AnuncioFormErrors {
	const errors: AnuncioFormErrors = {}
	const titulo = form.titulo.trim()
	const descricao = form.descricao.trim()

	if (titulo.length < 3) {
		errors.titulo = 'Informe um título com pelo menos 3 caracteres.'
	} else if (titulo.length > 80) {
		errors.titulo = 'O título pode ter no máximo 80 caracteres.'
	}

	if (descricao.length < 10) {
		errors.descricao = 'Conte um pouco mais sobre o item (mínimo de 10 caracteres).'
	}

	if (!form.categoriaId) {
		errors.categoriaId = 'Selecione uma categoria.'
	}

	if (form.tipo === 'VENDA') {
		const preco = Number(form.preco)

		if (!form.preco.trim() || !Number.isFinite(preco) || preco <= 0) {
			errors.preco = 'Informe um preço maior que zero.'
		} else if (!PRICE_PATTERN.test(form.preco)) {
			errors.preco = 'Use no máximo duas casas decimais.'
		} else if (preco > MAX_ANUNCIO_PRICE) {
			errors.preco = 'O preço máximo permitido é R$ 999.999,99.'
		}
	}

	if (!form.imagem && !hasCurrentImage) {
		errors.imagem = 'Adicione uma foto do produto.'
	}

	return errors
}

interface UseAnuncioFormOptions {
	initialValues?: AnuncioFormInitialValues
	submitErrorMessage: string
	onSubmit: (values: AnuncioFormValues) => Promise<void>
}

function useAnuncioForm({
	initialValues,
	submitErrorMessage,
	onSubmit,
}: UseAnuncioFormOptions) {
	const [form, setForm] = useState<AnuncioFormDraft>(() => createInitialForm(initialValues))
	const [errors, setErrors] = useState<AnuncioFormErrors>({})
	const [submitError, setSubmitError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const updateField: AnuncioFieldChange = (field, value) => {
		setForm((current) => ({ ...current, [field]: value }))
		setErrors((current) => ({ ...current, [field]: undefined }))
		setSubmitError('')
	}

	function updateType(tipo: TipoAnuncio) {
		setForm((current) => ({
			...current,
			tipo,
			preco: tipo === 'DOACAO' ? '' : current.preco,
		}))
		setErrors((current) => ({ ...current, preco: undefined }))
		setSubmitError('')
	}

	function updateImageError(message: string) {
		setErrors((current) => ({ ...current, imagem: message || undefined }))
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const formElement = event.currentTarget

		const validationErrors = validateForm(form, Boolean(initialValues?.imagemUrl))
		setErrors(validationErrors)
		setSubmitError('')

		if (Object.keys(validationErrors).length > 0) {
			requestAnimationFrame(() => focusFirstInvalidField(formElement))
			return
		}

		try {
			setIsSubmitting(true)
			await onSubmit({
				titulo: form.titulo.trim(),
				descricao: form.descricao.trim(),
				tipo: form.tipo,
				preco: form.tipo === 'VENDA' ? Number(form.preco) : null,
				categoriaId: Number(form.categoriaId),
				imagem: form.imagem,
			})
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : submitErrorMessage)
		} finally {
			setIsSubmitting(false)
		}
	}

	return {
		form,
		errors,
		submitError,
		isSubmitting,
		updateField,
		updateType,
		updateImageError,
		submit,
	}
}

export function AnuncioForm({
	categorias,
	mode = 'create',
	initialValues,
	isLoadingCategorias = false,
	categoriasError,
	onRetryCategorias,
	onSubmit,
	onCancel,
}: AnuncioFormProps) {
	const copy = formCopy[mode]
	const controller = useAnuncioForm({
		initialValues,
		submitErrorMessage: copy.error,
		onSubmit,
	})
	const categoriasIndisponiveis =
		isLoadingCategorias || Boolean(categoriasError) || categorias.length === 0

	return (
		<form
			onSubmit={controller.submit}
			noValidate
			className='overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_50px_rgba(23,59,50,0.07)]'
		>
			<div className='grid lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.35fr)]'>
				<AnuncioPhotoSection
					file={controller.form.imagem}
					currentImageUrl={initialValues?.imagemUrl}
					error={controller.errors.imagem}
					disabled={controller.isSubmitting}
					onFileChange={(file) => controller.updateField('imagem', file)}
					onErrorChange={controller.updateImageError}
				/>

				<AnuncioDetailsSection
					form={controller.form}
					errors={controller.errors}
					categorias={categorias}
					description={copy.details}
					disabled={controller.isSubmitting}
					isLoadingCategorias={isLoadingCategorias}
					categoriasError={categoriasError}
					submitError={controller.submitError}
					onFieldChange={controller.updateField}
					onRetryCategorias={onRetryCategorias}
					onTypeChange={controller.updateType}
				/>
			</div>

			<AnuncioFormFooter
				hint={copy.footer}
				submitLabel={copy.submit}
				submittingLabel={copy.submitting}
				isSubmitting={controller.isSubmitting}
				isSubmitDisabled={controller.isSubmitting || categoriasIndisponiveis}
				onCancel={onCancel}
			/>
		</form>
	)
}
