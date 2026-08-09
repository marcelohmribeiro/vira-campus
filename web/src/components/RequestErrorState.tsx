import { PackageX, RefreshCw } from 'lucide-react'

import { Button } from 'src/components/ui/button'

interface RequestErrorStateProps {
	title: string
	message: string
	onRetry: () => void
}

export function RequestErrorState({ title, message, onRetry }: RequestErrorStateProps) {
	return (
		<div role='alert' className='flex min-h-80 flex-col items-center justify-center rounded-3xl border border-border bg-card px-6 py-12 text-center'>
			<span className='flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
				<PackageX className='size-7' />
			</span>
			<h1 className='mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground'>{title}</h1>
			<p className='mt-2 max-w-sm text-sm leading-6 text-muted-foreground'>{message}</p>
			<Button type='button' variant='outline' onClick={onRetry} className='mt-6 h-11 rounded-xl px-4'>
				<RefreshCw className='size-4' />
				Tentar novamente
			</Button>
		</div>
	)
}
