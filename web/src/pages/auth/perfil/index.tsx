import { UserRoundCog } from 'lucide-react'
import { toast } from 'sonner'

import { getApiErrorMessage } from 'src/lib/apiErrors'
import { atualizarPerfil, type PerfilFormValues } from 'src/services'
import useAuthStore from 'src/store/authStore'

import { ProfileForm } from './components'

export default function Perfil() {
	const user = useAuthStore((state) => state.user)
	const updateUser = useAuthStore((state) => state.updateUser)

	async function handleUpdate(values: PerfilFormValues) {
		try {
			const updatedUser = await atualizarPerfil(values)
			updateUser(updatedUser)
			toast.success('Perfil atualizado com sucesso!')
		} catch (error) {
			throw new Error(
				getApiErrorMessage(error, 'Não foi possível atualizar seu perfil. Tente novamente.'),
			)
		}
	}

	return (
		<div className='mx-auto flex w-full max-w-5xl flex-col gap-6'>
			<PageHeader />

			{user ? (
				<ProfileForm user={user} onSubmit={handleUpdate} />
			) : (
				<div role='alert' className='rounded-3xl border border-border bg-card px-6 py-12 text-center'>
					<h2 className='text-lg font-semibold text-foreground'>Perfil indisponível</h2>
					<p className='mt-2 text-sm text-muted-foreground'>
						Entre novamente para carregar os dados da sua conta.
					</p>
				</div>
			)}
		</div>
	)
}

function PageHeader() {
	return (
		<header className='flex items-start gap-3.5'>
			<span className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground'>
				<UserRoundCog aria-hidden='true' className='size-5' />
			</span>
			<div>
				<h1 className='text-2xl font-semibold tracking-[-0.035em] text-foreground'>Meu perfil</h1>
				<p className='mt-1 text-sm leading-6 text-muted-foreground'>
					Atualize como seu perfil aparece para a comunidade do campus.
				</p>
			</div>
		</header>
	)
}
