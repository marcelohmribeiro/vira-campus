import { Skeleton } from 'src/components/ui/skeleton'

export function ProductCardSkeleton() {
	return (
		<div className='flex flex-col overflow-hidden rounded-2xl border border-border bg-card'>
			<Skeleton className='aspect-4/3 w-full rounded-none' />
			<div className='flex flex-col gap-3 p-4'>
				<Skeleton className='h-4 w-3/4' />
				<Skeleton className='h-4 w-1/3' />
				<div className='flex items-center gap-2 pt-2'>
					<Skeleton className='size-6 rounded-full' />
					<Skeleton className='h-3 w-20' />
				</div>
			</div>
		</div>
	)
}