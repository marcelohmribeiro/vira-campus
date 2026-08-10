import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, Loader2, Mail, Save, UserRound } from 'lucide-react'

import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import type { PerfilFormValues } from 'src/services/usuarios'
import type { Usuario } from 'src/types'

import { cropProfileImage } from './cropProfileImage'
import { ProfilePhotoUpload } from './ProfilePhotoUpload'

const DEFAULT_VERTICAL_POSITION = 50

interface ProfileFormProps {
	user: Usuario
	onSubmit: (values: PerfilFormValues) => Promise<void>
}

export function ProfileForm({ user, onSubmit }: ProfileFormProps) {
	const nameInputRef = useRef<HTMLInputElement>(null)
	const [name, setName] = useState(user.nome)
	const [image, setImage] = useState<File | null>(null)
	const [verticalPosition, setVerticalPosition] = useState(DEFAULT_VERTICAL_POSITION)
	const [nameError, setNameError] = useState('')
	const [submitError, setSubmitError] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const normalizedName = name.trim()
	const hasChanges = normalizedName !== user.nome || Boolean(image)

	useEffect(() => {
		setName(user.nome)
	}, [user.nome])

	function validateName() {
		if (normalizedName.length < 2) return 'O nome deve ter pelo menos 2 caracteres.'
		if (normalizedName.length > 100) return 'O nome deve ter no máximo 100 caracteres.'

		return ''
	}

	function discardChanges() {
		setName(user.nome)
		setImage(null)
		setVerticalPosition(DEFAULT_VERTICAL_POSITION)
		setNameError('')
		setSubmitError('')
	}

	function handleImageChange(file: File | null) {
		setImage(file)
		setVerticalPosition(DEFAULT_VERTICAL_POSITION)
		setSubmitError('')
	}

	function handleVerticalPositionChange(position: number) {
		setVerticalPosition(position)
		setSubmitError('')
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const validationMessage = validateName()
		setNameError(validationMessage)
		setSubmitError('')

		if (validationMessage) {
			nameInputRef.current?.focus()
			return
		}

		if (!hasChanges) return

		try {
			setIsSaving(true)
			const croppedImage = image
				? await cropProfileImage(image, verticalPosition)
				: null

			await onSubmit({ nome: normalizedName, imagem: croppedImage })
			setImage(null)
			setVerticalPosition(DEFAULT_VERTICAL_POSITION)
		} catch (error) {
			setSubmitError(
				error instanceof Error
					? error.message
					: 'Não foi possível salvar as alterações. Tente novamente.',
			)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			aria-busy={isSaving}
			className='overflow-hidden rounded-3xl border border-border bg-card shadow-[0_16px_40px_rgba(23,59,50,0.06)]'
		>
			<div className='grid xl:grid-cols-[0.78fr_1.22fr]'>
				<div className='border-b border-border bg-muted/30 p-5 sm:p-7 xl:border-r xl:border-b-0'>
					<ProfilePhotoUpload
						currentImageUrl={user.fotoPerfilUrl}
						file={image}
						name={normalizedName || user.nome}
						verticalPosition={verticalPosition}
						onFileChange={handleImageChange}
						onVerticalPositionChange={handleVerticalPositionChange}
						disabled={isSaving}
					/>
				</div>

				<section className='p-5 sm:p-7'>
					<div>
						<h2 className='text-lg font-semibold tracking-[-0.025em] text-foreground'>Dados pessoais</h2>
						<p className='mt-1 text-sm leading-6 text-muted-foreground'>
							Mantenha seu nome atualizado para que outros estudantes reconheçam você.
						</p>
					</div>

					<div className='mt-6 space-y-5'>
						<div>
							<label htmlFor='profile-name' className='text-sm font-medium text-foreground'>
								Nome
							</label>
							<div className='relative mt-2'>
								<UserRound
									aria-hidden='true'
									className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground'
								/>
								<Input
									ref={nameInputRef}
									id='profile-name'
									value={name}
									onChange={(event) => {
										setName(event.target.value)
										if (nameError) setNameError('')
										if (submitError) setSubmitError('')
									}}
									disabled={isSaving}
									maxLength={100}
									autoComplete='name'
									aria-invalid={Boolean(nameError)}
									aria-describedby={nameError ? 'profile-name-error' : undefined}
									className='h-12 rounded-xl bg-[#fbfcf9] pr-4 pl-10 focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15'
								/>
							</div>
							{nameError && (
								<p id='profile-name-error' role='alert' className='mt-2 flex items-center gap-1.5 text-xs text-destructive'>
									<AlertCircle aria-hidden='true' className='size-3.5 shrink-0' />
									{nameError}
								</p>
							)}
						</div>

						<div>
							<label htmlFor='profile-email' className='text-sm font-medium text-foreground'>
								E-mail
							</label>
							<div className='relative mt-2'>
								<Mail
									aria-hidden='true'
									className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground'
								/>
								<Input
									id='profile-email'
									value={user.email}
									readOnly
									aria-readonly='true'
									className='h-12 cursor-default rounded-xl bg-muted/50 pr-4 pl-10 text-muted-foreground'
								/>
							</div>
							<p className='mt-2 text-xs leading-5 text-muted-foreground'>
								Seu e-mail é usado para entrar e não pode ser alterado aqui.
							</p>
						</div>
					</div>
				</section>
			</div>

			<footer className='border-t border-border bg-muted/25 p-4 sm:p-5'>
				{submitError && (
					<p role='alert' className='mb-4 flex items-start gap-2 rounded-xl bg-destructive/8 px-3.5 py-3 text-sm text-destructive'>
						<AlertCircle aria-hidden='true' className='mt-0.5 size-4 shrink-0' />
						{submitError}
					</p>
				)}

				<div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
					<Button
						type='button'
						variant='outline'
						onClick={discardChanges}
						disabled={isSaving || !hasChanges}
						className='h-11 w-full rounded-xl px-5 sm:w-auto'
					>
						Descartar alterações
					</Button>
					<Button
						type='submit'
						disabled={isSaving || !hasChanges}
						className='h-11 w-full rounded-xl px-5 font-semibold shadow-[0_8px_18px_rgba(23,59,50,0.18)] sm:w-auto'
					>
						{isSaving ? (
							<>
								<Loader2 aria-hidden='true' className='size-4 animate-spin' />
								Salvando...
							</>
						) : (
							<>
								<Save aria-hidden='true' className='size-4' />
								Salvar alterações
							</>
						)}
					</Button>
				</div>
			</footer>
		</form>
	)
}
