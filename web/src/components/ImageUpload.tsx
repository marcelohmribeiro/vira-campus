import {
	useEffect,
	useId,
	useRef,
	useState,
	type ChangeEvent,
	type DragEvent,
} from 'react'
import { AlertCircle, RefreshCw, Trash2, Undo2, UploadCloud } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { cn } from 'src/lib/utils'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 2 * 1024 * 1024

export interface ImageUploadProps {
	file: File | null
	onFileChange: (file: File | null) => void
	error?: string
	onErrorChange?: (error: string) => void
	currentImageUrl?: string
	disabled?: boolean
}

function formatFileSize(size: number) {
	if (size < 1024) return `${size} B`
	if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`

	return `${(size / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

export function ImageUpload({
	file,
	onFileChange,
	error,
	onErrorChange,
	currentImageUrl,
	disabled = false,
}: ImageUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const dragDepthRef = useRef(0)
	const messageId = useId()
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [validationError, setValidationError] = useState('')
	const displayedError = error || validationError
	const displayedImageUrl = previewUrl ?? currentImageUrl

	useEffect(() => {
		if (!file) {
			setPreviewUrl(null)
			return
		}

		const objectUrl = URL.createObjectURL(file)
		setPreviewUrl(objectUrl)

		return () => URL.revokeObjectURL(objectUrl)
	}, [file])

	function updateError(message: string) {
		setValidationError(message)
		onErrorChange?.(message)
	}

	function validateAndSelect(selectedFile: File) {
		if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
			updateError('Formato inválido. Envie uma imagem JPEG, PNG ou WebP.')
			return
		}

		if (selectedFile.size > MAX_FILE_SIZE) {
			updateError('A imagem deve ter no máximo 2 MB.')
			return
		}

		updateError('')
		onFileChange(selectedFile)
	}

	function openFileDialog() {
		if (disabled) return

		if (inputRef.current) {
			inputRef.current.value = ''
			inputRef.current.click()
		}
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const selectedFile = event.currentTarget.files?.[0]
		event.currentTarget.value = ''

		if (selectedFile) validateAndSelect(selectedFile)
	}

	function handleRemove() {
		if (disabled) return

		if (inputRef.current) inputRef.current.value = ''
		updateError('')
		onFileChange(null)
	}

	function handleDragEnter(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
		event.stopPropagation()

		if (disabled || !Array.from(event.dataTransfer.types).includes('Files')) return

		dragDepthRef.current += 1
		setIsDragging(true)
	}

	function handleDragOver(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
		event.stopPropagation()
		event.dataTransfer.dropEffect = disabled ? 'none' : 'copy'
	}

	function handleDragLeave(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
		event.stopPropagation()

		if (disabled) return

		dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
		if (dragDepthRef.current === 0) setIsDragging(false)
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault()
		event.stopPropagation()
		dragDepthRef.current = 0
		setIsDragging(false)

		if (disabled) return

		const droppedFiles = Array.from(event.dataTransfer.files)
		if (droppedFiles.length === 0) return

		if (droppedFiles.length > 1) {
			updateError('Envie apenas uma imagem por vez.')
			return
		}

		validateAndSelect(droppedFiles[0])
	}

	return (
		<div className='w-full'>
			<input
				ref={inputRef}
				type='file'
				accept='image/jpeg,image/jpg,image/png,image/webp'
				onChange={handleInputChange}
				disabled={disabled}
				tabIndex={-1}
				aria-label='Selecionar imagem do produto'
				aria-describedby={messageId}
				aria-invalid={Boolean(displayedError)}
				className='sr-only'
			/>

			<div
				onDragEnter={handleDragEnter}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					'relative overflow-hidden rounded-2xl border border-dashed border-border bg-card transition-colors',
					isDragging && 'border-primary bg-secondary/60 ring-3 ring-primary/10',
					displayedError && 'border-destructive/70',
					disabled && 'cursor-not-allowed opacity-60'
				)}
			>
				{displayedImageUrl ? (
					<div className='relative aspect-4/3 min-h-56 w-full sm:aspect-video'>
						<img
							src={displayedImageUrl}
							alt={file ? `Pré-visualização de ${file.name}` : 'Foto atual do produto'}
							className='size-full object-cover'
						/>
						<div className='absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-linear-to-t from-primary/90 via-primary/65 to-transparent px-4 pt-14 pb-4 text-primary-foreground sm:flex-row sm:items-end sm:justify-between'>
							<div className='min-w-0'>
								<p className='truncate text-sm font-semibold'>
									{file?.name ?? 'Foto atual do anúncio'}
								</p>
								<p className='mt-0.5 text-xs text-primary-foreground/75'>
									{file ? formatFileSize(file.size) : 'Imagem já publicada'}
								</p>
							</div>

							<div className='flex shrink-0 gap-2'>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={openFileDialog}
									disabled={disabled}
									className='h-9 flex-1 border-white/35 bg-white/90 px-3 text-foreground hover:bg-white sm:flex-none'
								>
									<RefreshCw aria-hidden='true' />
									Substituir
								</Button>
								{file && (
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={handleRemove}
										disabled={disabled}
										className={cn(
											'h-9 flex-1 border-white/35 bg-white/90 px-3 hover:bg-white sm:flex-none',
											currentImageUrl && 'text-foreground',
											!currentImageUrl && 'text-destructive hover:text-destructive',
										)}
									>
										{currentImageUrl ? <Undo2 aria-hidden='true' /> : <Trash2 aria-hidden='true' />}
										{currentImageUrl ? 'Desfazer' : 'Remover'}
									</Button>
								)}
							</div>
						</div>
					</div>
				) : (
					<button
						type='button'
						onClick={openFileDialog}
						disabled={disabled}
						aria-describedby={messageId}
						aria-invalid={Boolean(displayedError)}
						className='flex min-h-56 w-full flex-col items-center justify-center px-5 py-10 text-center outline-none transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/50 disabled:cursor-not-allowed'
					>
						<span className='mb-4 flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground'>
							<UploadCloud aria-hidden='true' className='size-6' />
						</span>
						<span className='text-sm font-semibold text-foreground'>
							Clique para selecionar uma imagem
						</span>
						<span className='mt-1.5 text-xs leading-5 text-muted-foreground'>
							ou arraste e solte o arquivo aqui
						</span>
					</button>
				)}

				{isDragging && (
					<div className='pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-secondary/95 px-5 text-center text-secondary-foreground'>
						<UploadCloud aria-hidden='true' className='mb-3 size-8' />
						<p className='text-sm font-semibold'>Solte a imagem para enviar</p>
					</div>
				)}
			</div>

			<div
				id={messageId}
				role={displayedError ? 'alert' : undefined}
				aria-live='polite'
				className={cn(
					'mt-2.5 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground',
					displayedError && 'text-destructive'
				)}
			>
				{displayedError && <AlertCircle aria-hidden='true' className='mt-0.5 size-3.5 shrink-0' />}
				<span>
					{displayedError ||
						(currentImageUrl && !file
							? 'A foto atual será mantida se você não escolher outra.'
							: 'JPEG, PNG ou WebP, com no máximo 2 MB.')}
				</span>
			</div>
		</div>
	)
}
