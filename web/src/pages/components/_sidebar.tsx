import { Link, useLocation } from 'react-router-dom'
import { cn } from 'src/lib/utils'
import { User, ChevronLeft, Recycle } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { navigation } from 'src/constants'
import type { NavigationItem } from 'src/constants'

interface SidebarContentProps {
	collapsed: boolean
}

function SidebarContent({ collapsed }: SidebarContentProps) {
	const location = useLocation()
	const showLabels = !collapsed

	return (
		<div className='flex h-full flex-col'>
			<div className='flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-4'>
				<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-[0_6px_16px_rgba(182,239,103,0.3)]'>
					<Recycle className='size-4.5' strokeWidth={2.4} />
				</span>
				{showLabels && (
					<span className='text-sm font-semibold tracking-[-0.02em] text-foreground'>ViraCampus</span>
				)}
			</div>

			<nav className='flex-1 space-y-1 overflow-y-auto p-3'>
				{showLabels && (
					<p className='px-3 pb-1 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase'>
						Menu
					</p>
				)}
				{navigation.map((item: NavigationItem) => {
					const Icon = item.icon
					const isActive =
						location.pathname === item.href ||
						(Boolean(item.matchPrefix) && location.pathname.startsWith(`${item.href}/`))

					return (
						<Link
							key={item.href}
							to={item.href}
							aria-current={isActive ? 'page' : undefined}
							aria-label={collapsed ? item.title : undefined}
							title={collapsed ? item.title : undefined}
							className={cn(
								'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
								isActive
									? 'bg-primary text-primary-foreground shadow-[0_8px_18px_rgba(23,59,50,0.18)]'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground',
								collapsed && 'md:justify-center'
							)}
						>
							<Icon className='size-5 shrink-0' />
							{showLabels && <span>{item.title}</span>}
						</Link>
					)
				})}
			</nav>

			<div className='shrink-0 border-t border-border p-3'>
				<Link
					to='/auth/perfil'
					aria-label={collapsed ? 'Configurações' : undefined}
					title={collapsed ? 'Configurações' : undefined}
					className={cn(
						'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
						collapsed && 'md:justify-center'
					)}
				>
					<User className='size-5 shrink-0' />
					{showLabels && <span>Perfil</span>}
				</Link>
			</div>
		</div>
	)
}

interface SidebarProps {
	collapsed: boolean
	onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
	return (
		<aside
			className={cn(
				'fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-card transition-all duration-300 md:block',
				collapsed ? 'w-16' : 'w-64'
			)}
		>
			<SidebarContent collapsed={collapsed} />

			<Button
				variant='ghost'
				size='icon'
				onClick={onToggle}
				aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
				aria-expanded={!collapsed}
				title={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
				className='absolute -right-3.5 top-[3.7rem] size-7 rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground'
			>
				<ChevronLeft className={cn('size-3.5 transition-transform', collapsed && 'rotate-180')} />
			</Button>
		</aside>
	)
}
