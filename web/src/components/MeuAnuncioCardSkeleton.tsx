import { Skeleton } from 'src/components/ui/skeleton'

export function MeuAnuncioCardSkeleton() {
	return (
		<div
			role='status'
			aria-label='Carregando anúncio'
			className='overflow-hidden rounded-2xl border border-border bg-card sm:grid sm:grid-cols-[12rem_minmax(0,1fr)]'
		>
			<Skeleton className='aspect-16/10 min-h-44 rounded-none sm:aspect-auto sm:min-h-full' />

			<div className='flex min-w-0 flex-col p-4 sm:p-5' aria-hidden='true'>
				<div className='flex items-center justify-between gap-3'>
					<Skeleton className='h-5 w-24 rounded-full' />
					<Skeleton className='h-4 w-28' />
				</div>

				<Skeleton className='mt-4 h-5 w-4/5' />
				<Skeleton className='mt-3 h-6 w-32' />

				<div className='mt-3 space-y-2'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-2/3' />
				</div>

				<div className='mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4 sm:flex'>
					<Skeleton className='h-11 flex-1 rounded-xl' />
					<Skeleton className='h-11 flex-1 rounded-xl' />
					<Skeleton className='col-span-2 h-11 flex-1 rounded-xl' />
				</div>
			</div>
		</div>
	)
}
