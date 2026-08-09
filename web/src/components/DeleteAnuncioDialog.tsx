import type { MouseEvent } from 'react'
import { Loader2, TriangleAlert } from 'lucide-react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from 'src/components/ui/alert-dialog'
import type { Anuncio } from 'src/types'

export interface DeleteAnuncioDialogProps {
	anuncio: Anuncio | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => Promise<void> | void
	isDeleting: boolean
	errorMessage?: string
}

export function DeleteAnuncioDialog({
	anuncio,
	open,
	onOpenChange,
	onConfirm,
	isDeleting,
	errorMessage,
}: DeleteAnuncioDialogProps) {
	function handleOpenChange(nextOpen: boolean) {
		if (!isDeleting) onOpenChange(nextOpen)
	}

	function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault()
		void onConfirm()
	}

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogContent
				aria-busy={isDeleting}
				onEscapeKeyDown={(event) => {
					if (isDeleting) event.preventDefault()
				}}
				className='max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl data-[size=default]:max-w-md'
			>
				<AlertDialogHeader>
					<AlertDialogMedia className='rounded-full bg-destructive/10 text-destructive'>
						<TriangleAlert aria-hidden='true' />
					</AlertDialogMedia>

					<AlertDialogTitle className='text-xl font-semibold tracking-[-0.025em] text-foreground'>
						Excluir anúncio?
					</AlertDialogTitle>

					<AlertDialogDescription className='leading-6'>
						Você está prestes a excluir{' '}
						<strong className='font-semibold text-foreground'>
							{anuncio ? `“${anuncio.titulo}”` : 'este anúncio'}
						</strong>
						. Esta ação é irreversível e o produto deixará de aparecer no ViraCampus.
					</AlertDialogDescription>
				</AlertDialogHeader>

				{errorMessage && (
					<p
						role='alert'
						className='rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm leading-5 text-destructive'
					>
						{errorMessage}
					</p>
				)}

				<AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
					<AlertDialogCancel
						type='button'
						disabled={isDeleting}
						className='h-11 w-full rounded-xl sm:w-auto'
					>
						Cancelar
					</AlertDialogCancel>

					<AlertDialogAction
						type='button'
						variant='destructive'
						disabled={isDeleting || !anuncio}
						onClick={handleConfirm}
						className='h-11 w-full rounded-xl sm:w-auto'
					>
						{isDeleting && <Loader2 className='animate-spin' aria-hidden='true' />}
						{isDeleting ? 'Excluindo anúncio...' : 'Excluir anúncio'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
