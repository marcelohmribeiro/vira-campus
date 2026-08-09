import {
	Check,
	DollarSign,
	FileText,
	Gift,
	Info,
	Loader2,
	RefreshCw,
	Tag,
} from 'lucide-react'

import { Button } from 'src/components/ui/button'
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
import type {
	AnuncioFieldChange,
	AnuncioFormDraft,
	AnuncioFormErrors,
} from './AnuncioForm'
import { ImageUpload } from './ImageUpload'

const inputClassName =
	'h-11 rounded-xl border-border bg-[#fbfcf9] px-3.5 text-foreground placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15 aria-invalid:border-destructive aria-invalid:ring-destructive/15'

interface SectionHeadingProps {
	step: number
	title: string
	description: string
}

function SectionHeading({ step, title, description }: SectionHeadingProps) {
	return (
		<div className='mb-5'>
			<div className='mb-2 flex items-center gap-2'>
				<span className='flex size-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground'>
					{step}
				</span>
				<h2 className='font-semibold tracking-[-0.02em] text-foreground'>{title}</h2>
			</div>
			<p className='text-sm leading-5 text-muted-foreground'>{description}</p>
		</div>
	)
}

function FieldError({ id, children }: { id: string; children?: string }) {
	if (!children) return null

	return (
		<p id={id} role='alert' className='text-xs font-medium text-destructive'>
			{children}
		</p>
	)
}

interface AnuncioPhotoSectionProps {
	file: File | null
	currentImageUrl?: string
	error?: string
	disabled: boolean
	onFileChange: (file: File | null) => void
	onErrorChange: (message: string) => void
}

export function AnuncioPhotoSection({
	file,
	currentImageUrl,
	error,
	disabled,
	onFileChange,
	onErrorChange,
}: AnuncioPhotoSectionProps) {
	return (
		<aside className='border-b border-border bg-muted/35 p-5 sm:p-6 lg:border-r lg:border-b-0 lg:p-7'>
			<SectionHeading
				step={1}
				title='Foto do produto'
				description='Uma boa foto deixa o anúncio mais claro e aumenta o interesse pelo item.'
			/>

			<ImageUpload
				file={file}
				currentImageUrl={currentImageUrl}
				onFileChange={onFileChange}
				error={error}
				onErrorChange={onErrorChange}
				disabled={disabled}
			/>

			<div className='mt-5 rounded-2xl border border-border bg-card/80 p-4'>
				<p className='flex items-center gap-2 text-xs font-semibold text-foreground'>
					<Info className='size-3.5 text-[#4f7c61]' />
					Para uma foto melhor
				</p>
				<ul className='mt-3 space-y-2 text-xs leading-5 text-muted-foreground'>
					<li className='flex gap-2'>
						<Check className='mt-0.5 size-3.5 shrink-0 text-[#4f7c61]' />
						Use um ambiente bem iluminado.
					</li>
					<li className='flex gap-2'>
						<Check className='mt-0.5 size-3.5 shrink-0 text-[#4f7c61]' />
						Mostre o estado real do produto.
					</li>
				</ul>
			</div>
		</aside>
	)
}

interface AnuncioTypeFieldProps {
	value: TipoAnuncio
	disabled: boolean
	onChange: (tipo: TipoAnuncio) => void
}

function AnuncioTypeField({ value, disabled, onChange }: AnuncioTypeFieldProps) {
	const options = [
		{
			value: 'VENDA' as const,
			label: 'Vender',
			description: 'Definir um preço',
			icon: DollarSign,
		},
		{
			value: 'DOACAO' as const,
			label: 'Doar',
			description: 'Sem cobrança',
			icon: Gift,
		},
	]

	return (
		<fieldset className='space-y-2.5'>
			<legend className='text-sm font-medium text-foreground'>O que você quer fazer?</legend>
			<div className='grid grid-cols-2 gap-3'>
				{options.map((option) => {
					const isSelected = value === option.value
					const Icon = option.icon

					return (
						<label
							key={option.value}
							className={cn(
								'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all focus-within:ring-3 focus-within:ring-ring/35 focus-within:ring-offset-2',
								isSelected
									? 'border-primary bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(23,59,50,0.13)]'
									: 'border-border bg-[#fbfcf9] text-muted-foreground hover:border-[#9aaba5]',
								disabled && 'cursor-not-allowed opacity-60',
							)}
						>
							<input
								type='radio'
								name='tipo'
								value={option.value}
								checked={isSelected}
								onChange={() => onChange(option.value)}
								disabled={disabled}
								className='sr-only'
							/>
							<span
								className={cn(
									'flex size-9 shrink-0 items-center justify-center rounded-lg',
									isSelected ? 'bg-white/12' : 'bg-muted',
								)}
							>
								<Icon className='size-4.5' />
							</span>
							<span className='min-w-0'>
								<span className='block text-sm font-semibold'>{option.label}</span>
								<span
									className={cn(
										'hidden text-[11px] sm:block',
										isSelected ? 'text-white/65' : 'text-muted-foreground',
									)}
								>
									{option.description}
								</span>
							</span>
						</label>
					)
				})}
			</div>
		</fieldset>
	)
}

interface FormFieldProps {
	form: AnuncioFormDraft
	errors: AnuncioFormErrors
	disabled: boolean
	onFieldChange: AnuncioFieldChange
}

function TitleField({ form, errors, disabled, onFieldChange }: FormFieldProps) {
	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between gap-3'>
				<label htmlFor='titulo' className='text-sm font-medium text-foreground'>
					Título do anúncio
				</label>
				<span
					className={cn(
						'text-[11px] text-muted-foreground',
						form.titulo.length > 80 && 'text-destructive',
					)}
				>
					{form.titulo.length}/80
				</span>
			</div>
			<div className='relative'>
				<Tag className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8a9a95]' />
				<Input
					id='titulo'
					name='titulo'
					value={form.titulo}
					onChange={(event) => onFieldChange('titulo', event.target.value)}
					placeholder='Ex.: Calculadora científica Casio'
					maxLength={80}
					disabled={disabled}
					aria-invalid={Boolean(errors.titulo)}
					aria-describedby={errors.titulo ? 'titulo-error' : undefined}
					className={cn(inputClassName, 'pl-10')}
				/>
			</div>
			<FieldError id='titulo-error'>{errors.titulo}</FieldError>
		</div>
	)
}

interface CategoryFieldProps extends FormFieldProps {
	categorias: Categoria[]
	isLoading: boolean
	loadError?: string
	onRetry?: () => void
}

function CategoryField({
	form,
	errors,
	disabled,
	onFieldChange,
	categorias,
	isLoading,
	loadError,
	onRetry,
}: CategoryFieldProps) {
	const isUnavailable = isLoading || Boolean(loadError) || categorias.length === 0

	return (
		<div className='space-y-2'>
			<label htmlFor='categoria' className='text-sm font-medium text-foreground'>
				Categoria
			</label>
			<Select
				value={form.categoriaId}
				onValueChange={(value) => onFieldChange('categoriaId', value)}
				disabled={disabled || isUnavailable}
			>
				<SelectTrigger
					id='categoria'
					aria-invalid={Boolean(errors.categoriaId)}
					aria-describedby={errors.categoriaId ? 'categoria-error' : undefined}
					className={cn(inputClassName, 'w-full')}
				>
					<SelectValue placeholder={isLoading ? 'Carregando...' : 'Selecione'} />
				</SelectTrigger>
				<SelectContent position='popper'>
					{categorias.map((categoria) => (
						<SelectItem key={categoria.id} value={String(categoria.id)}>
							{categoria.nome}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{loadError ? (
				<div className='flex items-center justify-between gap-2'>
					<p className='text-xs font-medium text-destructive'>{loadError}</p>
					{onRetry && (
						<Button
							type='button'
							variant='ghost'
							size='xs'
							onClick={onRetry}
							className='shrink-0 text-foreground'
						>
							<RefreshCw className='size-3' /> Tentar novamente
						</Button>
					)}
				</div>
			) : categorias.length === 0 && !isLoading ? (
				<p className='text-xs font-medium text-destructive'>Nenhuma categoria disponível.</p>
			) : (
				<FieldError id='categoria-error'>{errors.categoriaId}</FieldError>
			)}
		</div>
	)
}
const MAX_ANUNCIO_PRICE = 99_999_999.99
function PriceField({ form, errors, disabled, onFieldChange }: FormFieldProps) {
	const isDonation = form.tipo === 'DOACAO'

	return (
		<div className='space-y-2'>
			<label htmlFor='preco' className='text-sm font-medium text-foreground'>
				Preço{' '}
				{isDonation && (
					<span className='font-normal text-muted-foreground'>(não se aplica)</span>
				)}
			</label>
			<div className='relative'>
				<span className='pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-[#71817c]'>
					R$
				</span>
				<Input
					id='preco'
					name='preco'
					type='number'
					inputMode='decimal'
					min='0.01'
					max={MAX_ANUNCIO_PRICE}
					step='0.01'
					value={form.preco}
					onChange={(event) => onFieldChange('preco', event.target.value)}
					placeholder={isDonation ? 'Item para doação' : '0,00'}
					disabled={disabled || isDonation}
					aria-invalid={Boolean(errors.preco)}
					aria-describedby={errors.preco ? 'preco-error' : undefined}
					className={cn(inputClassName, 'pl-10 disabled:bg-muted')}
				/>
			</div>
			<FieldError id='preco-error'>{errors.preco}</FieldError>
		</div>
	)
}

function DescriptionField({ form, errors, disabled, onFieldChange }: FormFieldProps) {
	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between gap-3'>
				<label htmlFor='descricao' className='text-sm font-medium text-foreground'>
					Descrição
				</label>
				<span className='text-[11px] text-muted-foreground'>Mínimo de 10 caracteres</span>
			</div>
			<div className='relative'>
				<FileText className='pointer-events-none absolute top-3.5 left-3.5 size-4 text-[#8a9a95]' />
				<textarea
					id='descricao'
					name='descricao'
					value={form.descricao}
					onChange={(event) => onFieldChange('descricao', event.target.value)}
					rows={5}
					placeholder='Descreva o estado de conservação, tempo de uso e outras informações importantes.'
					disabled={disabled}
					aria-invalid={Boolean(errors.descricao)}
					aria-describedby={errors.descricao ? 'descricao-error' : undefined}
					className='min-h-30 w-full resize-y rounded-xl border border-border bg-[#fbfcf9] py-3 pr-3.5 pl-10 text-sm text-foreground outline-none transition-colors placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-3 focus-visible:ring-[#4f7c61]/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15'
				/>
			</div>
			<FieldError id='descricao-error'>{errors.descricao}</FieldError>
		</div>
	)
}

interface AnuncioDetailsSectionProps extends FormFieldProps {
	categorias: Categoria[]
	description: string
	isLoadingCategorias: boolean
	categoriasError?: string
	submitError: string
	onRetryCategorias?: () => void
	onTypeChange: (tipo: TipoAnuncio) => void
}

export function AnuncioDetailsSection({
	form,
	errors,
	categorias,
	description,
	disabled,
	isLoadingCategorias,
	categoriasError,
	submitError,
	onFieldChange,
	onRetryCategorias,
	onTypeChange,
}: AnuncioDetailsSectionProps) {
	const fieldProps = { form, errors, disabled, onFieldChange }

	return (
		<section className='p-5 sm:p-6 lg:p-7'>
			<SectionHeading step={2} title='Detalhes do anúncio' description={description} />

			<div className='space-y-5'>
				<AnuncioTypeField value={form.tipo} disabled={disabled} onChange={onTypeChange} />
				<TitleField {...fieldProps} />
				<div className='grid gap-5 sm:grid-cols-2'>
					<CategoryField
						{...fieldProps}
						categorias={categorias}
						isLoading={isLoadingCategorias}
						loadError={categoriasError}
						onRetry={onRetryCategorias}
					/>
					<PriceField {...fieldProps} />
				</div>
				<DescriptionField {...fieldProps} />

				{submitError && (
					<div
						role='alert'
						className='rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive'
					>
						{submitError}
					</div>
				)}
			</div>
		</section>
	)
}

interface AnuncioFormFooterProps {
	hint: string
	submitLabel: string
	submittingLabel: string
	isSubmitting: boolean
	isSubmitDisabled: boolean
	onCancel: () => void
}

export function AnuncioFormFooter({
	hint,
	submitLabel,
	submittingLabel,
	isSubmitting,
	isSubmitDisabled,
	onCancel,
}: AnuncioFormFooterProps) {
	return (
		<footer className='flex flex-col gap-3 border-t border-border bg-[#fbfcf9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-7'>
			<p className='text-center text-xs text-muted-foreground sm:text-left'>{hint}</p>
			<div className='flex flex-col gap-2.5 sm:flex-row'>
				<Button
					type='button'
					variant='outline'
					onClick={onCancel}
					disabled={isSubmitting}
					className='h-11 w-full rounded-xl px-5 focus-visible:ring-offset-2 sm:w-auto'
				>
					Cancelar
				</Button>
				<Button
					type='submit'
					disabled={isSubmitDisabled}
					className='h-11 w-full rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-[0_8px_18px_rgba(23,59,50,0.18)] hover:bg-[#234f43] focus-visible:ring-offset-2 sm:min-w-42 sm:w-auto'
				>
					{isSubmitting ? (
						<>
							<Loader2 className='size-4 animate-spin' /> {submittingLabel}
						</>
					) : (
						submitLabel
					)}
				</Button>
			</div>
		</footer>
	)
}
