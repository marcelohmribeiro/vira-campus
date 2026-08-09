import { useState } from 'react'
import { Archive, LogOut, Plus, Recycle, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from 'src/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
import { Button } from 'src/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { useAuth } from 'src/hooks/auth'
import { getInitials } from 'src/lib/formatters'

export function Topbar() {
	const { user, signout } = useAuth()
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

	return (
		<>
			<header className='sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6'>
				<div className='flex items-center gap-2 md:hidden'>
					<span className='flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-[0_4px_12px_rgba(182,239,103,0.25)]'>
						<Recycle className='size-4' strokeWidth={2.4} />
					</span>
					<span className='text-sm font-semibold tracking-[-0.02em] text-foreground'>
						ViraCampus
					</span>
				</div>

				<div className='ml-auto flex items-center gap-2'>
					<Button
						asChild
						className='hidden h-9 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_rgba(23,59,50,0.18)] hover:bg-[#234f43] md:inline-flex'
					>
						<Link to='/auth/anuncios/novo'>
							<Plus className='size-4' />
							Anunciar
						</Link>
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className='ml-1 flex size-9 items-center justify-center rounded-full ring-1 ring-border transition hover:ring-[#4f7c61]'>
								<Avatar className='size-8'>
									<AvatarImage src={user?.fotoPerfilUrl ?? undefined} alt={user?.nome} />
									<AvatarFallback className='bg-secondary text-xs font-semibold text-secondary-foreground'>
										{getInitials(user?.nome)}
									</AvatarFallback>
								</Avatar>
							</button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align='end' className='w-56'>
							<DropdownMenuLabel className='truncate'>
								{user?.nome ?? 'Minha conta'}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />

							<DropdownMenuItem asChild>
								<Link to='/auth/meus-anuncios' className='flex items-center gap-2'>
									<Archive className='size-4' /> Meus anúncios
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<Link to='/auth/perfil' className='flex items-center gap-2'>
									<User className='size-4' /> Meu perfil
								</Link>
							</DropdownMenuItem>

							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant='destructive'
								onSelect={() => setLogoutDialogOpen(true)}
							>
								<LogOut className='size-4' /> Sair
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			<LogoutDialog
				open={logoutDialogOpen}
				onOpenChange={setLogoutDialogOpen}
				onConfirm={signout}
			/>
		</>
	)
}

interface LogoutDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
}

function LogoutDialog({ open, onOpenChange, onConfirm }: LogoutDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<LogOut aria-hidden='true' />
					</AlertDialogMedia>
					<AlertDialogTitle>Sair da conta?</AlertDialogTitle>
					<AlertDialogDescription>
						Você precisará entrar novamente para acessar seus anúncios e reservas.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
					<AlertDialogCancel className='h-11 w-full rounded-xl sm:w-auto'>
						Continuar conectado
					</AlertDialogCancel>
					<AlertDialogAction
						variant='destructive'
						onClick={onConfirm}
						className='h-11 w-full rounded-xl sm:w-auto'
					>
						Sair da conta
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
