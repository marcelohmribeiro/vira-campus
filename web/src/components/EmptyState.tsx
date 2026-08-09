import { PackageSearch } from 'lucide-react'
import { Button } from 'src/components/ui/button'

interface EmptyStateProps {
	onClearFilters: () => void
	hasFilters: boolean
}

export function EmptyState({ onClearFilters, hasFilters }: EmptyStateProps) {
	return (
		<div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center'>
			<div className='mb-4 flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground'>
				<PackageSearch className='size-6' />
			</div>
			<h3 className='text-base font-semibold text-foreground'>Nenhum anúncio encontrado</h3>
			<p className='mt-1.5 max-w-xs text-sm leading-6 text-muted-foreground'>
				{hasFilters
					? 'Tente ajustar os filtros ou buscar por outro termo.'
					: 'Assim que novos itens forem publicados, eles aparecem por aqui.'}
			</p>
			{hasFilters && (
				<Button variant='outline' onClick={onClearFilters} className='mt-5 rounded-xl border-border text-foreground hover:bg-muted'>
					Limpar filtros
				</Button>
			)}
		</div>
	)
}