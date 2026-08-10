import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ProtectedRoute } from 'src/components/_protected-route'
import { Sidebar, Topbar, BottomTabs } from 'src/pages/components'
import { cn } from 'src/lib/utils'

export default function Layout() {
	const [collapsed, setCollapsed] = useState(false)

	return (
		<ProtectedRoute>
			<div className='flex h-screen w-full overflow-hidden bg-background'>
				{/* Sidebar — apenas no desktop */}
				<Sidebar
					collapsed={collapsed}
					onToggle={() => setCollapsed(!collapsed)}
				/>

				<div
					className={cn(
						'flex flex-1 flex-col overflow-hidden transition-all duration-300',
						'pl-0 md:pl-64',
						collapsed && 'md:pl-16'
					)}
				>
					<Topbar />
					<main className='flex-1 overflow-y-auto p-4 pb-[calc(5rem_+_env(safe-area-inset-bottom))] md:p-6 md:pb-6'>
						<Outlet />
					</main>
				</div>

				{/* Bottom Tab Bar — apenas no mobile */}
				<BottomTabs />
			</div>
		</ProtectedRoute>
	)
}
