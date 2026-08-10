import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Leaf, Lock, Mail } from 'lucide-react'

import {
	AuthBrand,
	AuthFormCard,
	AuthFormError,
	AuthInputField,
	AuthSidePanel,
	AuthSubmitButton,
	PasswordToggle,
} from 'src/pages/(public)/components'
import { useAuth } from 'src/hooks/auth'
import { getApiErrorMessage } from 'src/lib/apiErrors'

const communityBenefits = [
	{ icon: BookOpen, label: 'Livros e materiais' },
	{ icon: GraduationCap, label: 'Feito para estudantes' },
	{ icon: Leaf, label: 'Consumo consciente' },
]

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const { signin, isLoading } = useAuth()

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setErrorMessage('')

		try {
			await signin({ email, senha: password })
		} catch (error) {
			setErrorMessage(
				getApiErrorMessage(
					error,
					'Não foi possível entrar agora. Confira seus dados e tente novamente.',
				),
			)
		}
	}

	return (
		<main className='relative flex min-h-screen w-full flex-1 overflow-hidden bg-[#f7f8f2] text-[#173b32]'>
			<AuthSidePanel
				variant='login'
				eyebrow='Economia circular dentro do campus'
				title={
					<>
						O que você não usa pode{' '}
						<span className='text-[#b6ef67]'>transformar o semestre</span> de alguém.
					</>
				}
				description='Compre, venda ou doe itens para estudantes perto de você. Mais acesso, menos desperdício e uma comunidade que compartilha.'
				features={communityBenefits}
			/>

			<section className='relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12'>
				<div
					aria-hidden='true'
					className='absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_right,rgba(182,239,103,0.22),transparent_55%)] lg:hidden'
				/>

				<div className='relative z-10 w-full max-w-[430px]'>
					<AuthBrand size='mobile' className='mb-10 lg:hidden' />

					<AuthFormCard
						title='Que bom ter você de volta'
						description='Entre para continuar movimentando boas ideias pelo campus.'
					>
						<form onSubmit={handleSubmit} aria-busy={isLoading} className='space-y-5'>
							<AuthInputField
								id='email'
								name='email'
								type='email'
								autoComplete='email'
								label='E-mail'
								placeholder='voce@gmail.com'
								icon={Mail}
								value={email}
								onChange={(event) => {
									setEmail(event.target.value)
									setErrorMessage('')
								}}
								required
							/>

							<AuthInputField
								id='password'
								name='password'
								type={showPassword ? 'text' : 'password'}
								autoComplete='current-password'
								label='Senha'
								placeholder='Digite sua senha'
								icon={Lock}
								value={password}
								onChange={(event) => {
									setPassword(event.target.value)
									setErrorMessage('')
								}}
								labelAction={
									<a
										href='mailto:suporte@viracampus.com.br?subject=Recuperar%20senha'
										className='text-xs font-semibold text-[#376a4d] transition-colors hover:text-[#173b32] hover:underline hover:underline-offset-4'
									>
										Esqueci minha senha
									</a>
								}
								endAdornment={
									<PasswordToggle
										visible={showPassword}
										onToggle={() => setShowPassword((visible) => !visible)}
									/>
								}
								required
							/>

							<AuthFormError message={errorMessage} />
							<AuthSubmitButton
								isLoading={isLoading}
								label='Entrar na minha conta'
								loadingLabel='Entrando...'
							/>
						</form>

						<div className='my-6 flex items-center gap-3' aria-hidden='true'>
							<span className='h-px flex-1 bg-[#e5ebe6]' />
							<span className='text-[11px] font-medium tracking-[0.12em] text-[#94a19d] uppercase'>
								Primeiro acesso
							</span>
							<span className='h-px flex-1 bg-[#e5ebe6]' />
						</div>

						<p className='text-center text-sm text-[#64746f]'>
							Ainda não faz parte?{' '}
							<Link
								to='/cadastro'
								className='font-semibold text-[#2d5c43] hover:underline hover:underline-offset-4'
							>
								Cadastre-se aqui
							</Link>
						</p>
					</AuthFormCard>
				</div>
			</section>
		</main>
	)
}
