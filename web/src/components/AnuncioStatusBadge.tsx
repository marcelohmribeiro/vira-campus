import { Badge } from 'src/components/ui/badge'
import { cn } from 'src/lib/utils'
import type { StatusAnuncio } from 'src/types'

const statusPresentation: Record<StatusAnuncio, { label: string; className: string }> = {
	ATIVO: {
		label: 'Disponível',
		className: 'border-[#cfe8ab] bg-secondary text-secondary-foreground',
	},
	RESERVADO: {
		label: 'Reservado',
		className: 'border-amber-200 bg-amber-50 text-amber-700',
	},
	CONCLUIDO: {
		label: 'Concluído',
		className: 'border-border bg-muted text-muted-foreground',
	},
}

interface AnuncioStatusBadgeProps {
	status: StatusAnuncio
	className?: string
}

export function AnuncioStatusLabel({ status }: Pick<AnuncioStatusBadgeProps, 'status'>) {
	return statusPresentation[status].label
}

export function AnuncioStatusBadge({ status, className }: AnuncioStatusBadgeProps) {
	const presentation = statusPresentation[status]

	return (
		<Badge variant='outline' className={cn(className, presentation.className)}>
			{presentation.label}
		</Badge>
	)
}
