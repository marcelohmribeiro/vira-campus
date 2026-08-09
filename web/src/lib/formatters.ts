export function formatPrice(value: number | string | null): string {
	return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value ?? 0))
}

export function formatDate(dateString: string): string {
	return new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	}).format(new Date(dateString))
}

export function formatRelativeDate(dateString: string): string {
	const date = new Date(dateString)
	const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000)
	const diffHours = Math.round(diffMinutes / 60)
	const diffDays = Math.round(diffHours / 24)

	if (diffMinutes < 1) return 'agora mesmo'
	if (diffMinutes < 60) return `há ${diffMinutes} min`
	if (diffHours < 24) return `há ${diffHours}h`
	if (diffDays === 1) return 'ontem'
	if (diffDays < 7) return `há ${diffDays} dias`

	return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date)
}

export function getInitials(name: string = ''): string {
	return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}
