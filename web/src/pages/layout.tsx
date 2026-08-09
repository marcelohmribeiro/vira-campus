import { Outlet } from 'react-router-dom'
import { Toaster } from 'src/components/ui/sonner'

export default function Layout() {		
	return (
		<div className='flex min-h-screen w-full overflow-hidden bg-background'>
			<Outlet />
			<Toaster position='top-right' richColors closeButton />
		</div>
	)
}
