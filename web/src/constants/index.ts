import { Archive, Home, PackagePlus, type LucideIcon } from 'lucide-react'

export interface NavigationItem {
	title: string
	icon: LucideIcon
	href: string
	matchPrefix?: boolean
}

const navigation: NavigationItem[] = [
	{
		title: 'Explorar',
		icon: Home,
		href: '/auth/explorar',
	},
	{
		title: 'Meus anúncios',
		icon: Archive,
		href: '/auth/meus-anuncios',
		matchPrefix: true,
	},
	{
		title: 'Anunciar',
		icon: PackagePlus,
		href: '/auth/anuncios/novo',
	}
]

export { navigation }
