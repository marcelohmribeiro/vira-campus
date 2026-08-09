import { Skeleton } from 'src/components/ui/skeleton'

export function AnuncioDetailsSkeleton() {
	return (
		<div
			role='status'
			aria-busy='true'
			className='grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)] lg:items-start'
		>
			<span className='sr-only'>Carregando detalhes do anúncio...</span>

			<Skeleton className='aspect-4/3 w-full rounded-3xl lg:col-start-1 lg:row-start-1' />

			<div className='rounded-3xl border border-border bg-card p-5 sm:p-6 lg:col-start-2 lg:row-span-2'>
				<div className='flex gap-2'>
					<Skeleton className='h-7 w-24 rounded-full' />
					<Skeleton className='h-7 w-20 rounded-full' />
				</div>
				<Skeleton className='mt-6 h-8 w-11/12' />
				<Skeleton className='mt-3 h-8 w-1/2' />
				<Skeleton className='mt-6 h-12 w-full' />
				<div className='mt-6 flex items-center gap-3'>
					<Skeleton className='size-11 rounded-full' />
					<div className='flex-1 space-y-2'>
						<Skeleton className='h-4 w-2/3' />
						<Skeleton className='h-3 w-4/5' />
					</div>
				</div>
				<Skeleton className='mt-7 h-12 w-full rounded-xl' />
			</div>

			<div className='rounded-3xl border border-border bg-card p-5 sm:p-6 lg:col-start-1 lg:row-start-2'>
				<Skeleton className='h-6 w-44' />
				<div className='mt-5 space-y-3'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-4/5' />
				</div>
			</div>
		</div>
	)
}
