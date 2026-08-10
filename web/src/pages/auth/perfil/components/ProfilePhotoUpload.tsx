import {
	useEffect,
	useId,
	useRef,
	useState,
	type ChangeEvent,
	type SyntheticEvent,
} from 'react'
import { AlertCircle, ArrowDown, ArrowUp, Camera, RotateCcw } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
import { Button } from 'src/components/ui/button'
import { getInitials } from 'src/lib/formatters'
import { cn } from 'src/lib/utils'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 2 * 1024 * 1024

interface ProfilePhotoUploadProps {
	currentImageUrl: string | null
	file: File | null
	name: string
	verticalPosition: number
	onFileChange: (file: File | null) => void
	onVerticalPositionChange: (position: number) => void
	disabled?: boolean
}

export function ProfilePhotoUpload({
	currentImageUrl,
	file,
	name,
	verticalPosition,
	onFileChange,
	onVerticalPositionChange,
	disabled = false,
}: ProfilePhotoUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const messageId = useId()
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [errorMessage, setErrorMessage] = useState('')
	const [canAdjustVertically, setCanAdjustVertically] = useState(false)
	const displayedImageUrl = previewUrl ?? currentImageUrl ?? undefined

	useEffect(() => {
		if (!file) {
			setPreviewUrl(null)
			setCanAdjustVertically(false)
			return
		}

		const objectUrl = URL.createObjectURL(file)
		setPreviewUrl(objectUrl)
		setCanAdjustVertically(false)

		return () => URL.revokeObjectURL(objectUrl)
	}, [file])

	function openFileDialog() {
		if (disabled) return

		if (inputRef.current) {
			inputRef.current.value = ''
			inputRef.current.click()
		}
	}

	function selectFile(selectedFile: File) {
		if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
			setErrorMessage('Escolha uma imagem JPEG, PNG ou WebP.')
			onFileChange(null)
			return
		}

		if (selectedFile.size > MAX_FILE_SIZE) {
			setErrorMessage('A foto deve ter no máximo 2 MB.')
			onFileChange(null)
			return
		}

		setErrorMessage('')
		onFileChange(selectedFile)
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const selectedFile = event.currentTarget.files?.[0]
		if (selectedFile) selectFile(selectedFile)
	}

	function discardSelection() {
		setErrorMessage('')
		onFileChange(null)
	}

	function handlePreviewLoad(event: SyntheticEvent<HTMLImageElement>) {
		const image = event.currentTarget
		setCanAdjustVertically(Boolean(file) && image.naturalHeight > image.naturalWidth)
	}

	return (
		<div className='flex flex-col items-center text-center'>
			<input
				ref={inputRef}
				type='file'
				accept='image/jpeg,image/jpg,image/png,image/webp'
				onChange={handleInputChange}
				disabled={disabled}
				tabIndex={-1}
				aria-label='Selecionar foto de perfil'
				aria-describedby={messageId}
				className='sr-only'
			/>

			<div className='relative'>
				<Avatar className='size-28 ring-4 ring-background shadow-[0_12px_30px_rgba(23,59,50,0.14)] sm:size-32'>
					<AvatarImage
						src={displayedImageUrl}
						alt={`Foto de perfil de ${name}`}
						onLoad={handlePreviewLoad}
						style={file ? { objectPosition: `center ${verticalPosition}%` } : undefined}
					/>
					<AvatarFallback className='bg-secondary text-2xl font-semibold text-secondary-foreground sm:text-3xl'>
						{getInitials(name)}
					</AvatarFallback>
				</Avatar>
				<span
					aria-hidden='true'
					className='absolute right-0 bottom-1 flex size-9 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground'
				>
					<Camera aria-hidden='true' className='size-4' />
				</span>
			</div>

			<p className='mt-4 text-sm font-semibold text-foreground'>Foto de perfil</p>
			<p className='mt-1 max-w-xs text-xs leading-5 text-muted-foreground'>
				JPEG, PNG ou WebP, com no máximo 2 MB.
			</p>

			{file && canAdjustVertically && (
				<div className='mt-4 w-full max-w-xs rounded-2xl border border-border bg-card p-3.5 text-left'>
					<div className='flex flex-col items-start gap-1 xl:flex-row xl:items-center xl:justify-between xl:gap-3'>
						<label htmlFor='profile-photo-position' className='text-xs font-semibold text-foreground'>
							Ajustar enquadramento
						</label>
						<span className='text-[11px] text-muted-foreground'>
							{getPositionLabel(verticalPosition)}
						</span>
					</div>

					<div className='mt-3 flex items-center gap-2.5'>
						<ArrowUp aria-hidden='true' className='size-4 shrink-0 text-muted-foreground' />
						<input
							id='profile-photo-position'
							type='range'
							min='0'
							max='100'
							step='1'
							value={verticalPosition}
							onChange={(event) => onVerticalPositionChange(Number(event.target.value))}
							disabled={disabled}
							aria-label='Posição vertical da foto'
							className='h-2 min-w-0 flex-1 cursor-pointer accent-primary disabled:cursor-not-allowed'
						/>
						<ArrowDown aria-hidden='true' className='size-4 shrink-0 text-muted-foreground' />
					</div>
					<p className='mt-2 text-[11px] leading-4 text-muted-foreground'>
						Mova o controle até seu rosto ficar bem enquadrado.
					</p>
				</div>
			)}

			<div className='mt-4 flex w-full flex-col gap-2 xl:w-auto xl:flex-row'>
				<Button
					type='button'
					variant='outline'
					onClick={openFileDialog}
					disabled={disabled}
					aria-describedby={messageId}
					aria-invalid={Boolean(errorMessage)}
					className='h-11 w-full rounded-xl px-4 xl:w-auto'
				>
					<Camera aria-hidden='true' className='size-4' />
					{displayedImageUrl ? 'Trocar foto' : 'Escolher foto'}
				</Button>

				{file && (
					<Button
						type='button'
						variant='ghost'
						onClick={discardSelection}
						disabled={disabled}
						className='h-11 w-full rounded-xl px-4 text-muted-foreground xl:w-auto'
					>
						<RotateCcw aria-hidden='true' className='size-4' />
						Desfazer
					</Button>
				)}
			</div>

			<div
				id={messageId}
				role={errorMessage ? 'alert' : undefined}
				className={cn(
					'mt-3 flex min-h-5 items-start justify-center gap-1.5 text-xs text-muted-foreground',
					errorMessage && 'text-destructive',
				)}
			>
				{errorMessage && <AlertCircle aria-hidden='true' className='mt-0.5 size-3.5 shrink-0' />}
				<span className='min-w-0 break-words'>
					{errorMessage || (file ? file.name : 'Sua foto aparecerá nos seus anúncios.')}
				</span>
			</div>
		</div>
	)
}

function getPositionLabel(position: number) {
	if (position < 40) return 'Mais acima'
	if (position > 60) return 'Mais abaixo'

	return 'Centralizado'
}
