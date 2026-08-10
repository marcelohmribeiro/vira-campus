import { Link, useLocation } from 'react-router-dom'
import { Archive, Home, Plus } from 'lucide-react'
import { cn } from 'src/lib/utils'
import type { NavigationItem } from 'src/constants'

const exploreTab: NavigationItem = {
	title: 'Explorar',
	icon: Home,
	href: '/auth/explorar',
}

const myAdsTab: NavigationItem = {
	title: 'Meus anúncios',
	icon: Archive,
	href: '/auth/meus-anuncios',
	matchPrefix: true,
}

export function BottomTabs() {
	const location = useLocation()
	const isCreateActive = location.pathname === '/auth/anuncios/novo'

	return (
		<nav
			aria-label='Navegação principal'
			className='fixed right-0 bottom-0 left-0 z-50 flex h-[calc(4rem_+_env(safe-area-inset-bottom))] items-stretch border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden'
		>
			<TabItem item={exploreTab} isActive={isCurrentPath(location.pathname, exploreTab)} />

			<div className='relative flex flex-1 items-center justify-center'>
				<Link
					to='/auth/anuncios/novo'
					aria-label='Criar anúncio'
					aria-current={isCreateActive ? 'page' : undefined}
					className={cn(
						'flex size-13 -translate-y-3 items-center justify-center rounded-full bg-primary shadow-[0_8px_24px_rgba(23,59,50,0.35)] transition-all active:scale-95',
						isCreateActive && 'ring-3 ring-accent ring-offset-2 ring-offset-background',
					)}
				>
					<Plus className='size-5 text-primary-foreground' strokeWidth={2.5} />
				</Link>
			</div>

			<TabItem item={myAdsTab} isActive={isCurrentPath(location.pathname, myAdsTab)} />
		</nav>
	)
}

interface TabItemProps {
	item: NavigationItem
	isActive: boolean
}

function TabItem({ item, isActive }: TabItemProps) {
	const Icon = item.icon

	return (
		<Link
			to={item.href}
			aria-current={isActive ? 'page' : undefined}
			className='relative flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors'
		>
			<span
				className={cn(
					'flex size-8 items-center justify-center rounded-xl transition-all duration-200',
					isActive ? 'bg-primary/10' : 'bg-transparent'
				)}
			>
				<Icon
					className={cn(
						'size-5 transition-colors duration-200',
						isActive ? 'text-primary' : 'text-muted-foreground'
					)}
					strokeWidth={isActive ? 2.2 : 1.8}
				/>
			</span>
			<span
				className={cn(
					'text-[10px] font-medium tracking-wide transition-colors duration-200',
					isActive ? 'text-primary' : 'text-muted-foreground'
				)}
			>
				{item.title}
			</span>
			{isActive && (
				<span className='absolute bottom-1 size-1 rounded-full bg-primary' />
			)}
		</Link>
	)
}

function isCurrentPath(pathname: string, item: NavigationItem) {
	return pathname === item.href || (Boolean(item.matchPrefix) && pathname.startsWith(`${item.href}/`))
}
