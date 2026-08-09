import { Archive, Home, PackagePlus, User, type LucideIcon } from 'lucide-react'

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
	},
	{
		title: 'Perfil',
		icon: User,
		href: '/auth/perfil',
	},
]

export { navigation }
