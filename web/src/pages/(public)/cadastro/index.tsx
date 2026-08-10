import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Lock, Mail, UserRound } from 'lucide-react'
import { toast } from 'sonner'

import {
	AuthBrand,
	AuthFormCard,
	AuthFormError,
	AuthInputField,
	AuthSidePanel,
	AuthSubmitButton,
	PasswordToggle,
} from 'src/pages/(public)/components'
import { getApiErrorMessage } from 'src/lib/apiErrors'
import { api } from 'src/services/_api'

interface CadastroForm {
	nome: string
	email: string
	senha: string
	confirmarSenha: string
}

const initialForm: CadastroForm = {
	nome: '',
	email: '',
	senha: '',
	confirmarSenha: '',
}

const communityBenefits = [
	{ icon: Check, label: 'Publique itens para venda ou doação' },
	{ icon: Check, label: 'Conecte-se com estudantes próximos' },
	{ icon: Check, label: 'Ajude a reduzir o desperdício no campus' },
]

export default function Cadastro() {
	const navigate = useNavigate()
	const [form, setForm] = useState<CadastroForm>(initialForm)
	const [showPassword, setShowPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target
		setForm((currentForm) => ({ ...currentForm, [name]: value }))
		setErrorMessage('')
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (form.senha !== form.confirmarSenha) {
			setErrorMessage('As senhas não coincidem. Confira e tente novamente.')
			return
		}

		try {
			setIsSubmitting(true)
			setErrorMessage('')

			await api.post('/users', {
				nome: form.nome,
				email: form.email,
				senha: form.senha,
			})

			toast.success('Conta criada com sucesso!', {
				description: 'Entre com seus dados para acessar o ViraCampus.',
			})
			navigate('/login', { replace: true })
		} catch (error) {
			setErrorMessage(
				getApiErrorMessage(
					error,
					'Não foi possível criar sua conta agora. Tente novamente em instantes.',
				),
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className='relative flex min-h-screen w-full flex-1 bg-[#f7f8f2] text-[#173b32]'>
			<AuthSidePanel
				variant='cadastro'
				eyebrow='Seu campus, uma comunidade'
				title={
					<>
						Entre para a comunidade que faz as coisas{' '}
						<span className='text-[#b6ef67]'>circularem.</span>
					</>
				}
				description='Crie sua conta gratuitamente e encontre um novo destino para livros, eletrônicos e materiais acadêmicos.'
				features={communityBenefits}
			/>

			<section className='relative flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:h-screen lg:overflow-y-auto lg:px-12'>
				<div
					aria-hidden='true'
					className='absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_right,rgba(182,239,103,0.24),transparent_58%)] lg:hidden'
				/>

				<div className='relative z-10 w-full max-w-[500px]'>
					<div className='mb-5 flex items-center justify-between'>
						<Link
							to='/login'
							className='group flex items-center gap-2 text-sm font-medium text-[#64746f] transition-colors hover:text-[#173b32]'
						>
							<ArrowLeft className='size-4 transition-transform group-hover:-translate-x-0.5' />
							Voltar para o login
						</Link>

						<AuthBrand size='compact' className='lg:hidden' />
					</div>

					<AuthFormCard
						title='Crie sua conta'
						description='Leva menos de um minuto para fazer parte do ViraCampus.'
					>
						<form onSubmit={handleSubmit} aria-busy={isSubmitting} className='space-y-4'>
							<AuthInputField
								id='nome'
								name='nome'
								type='text'
								autoComplete='name'
								label='Nome completo'
								placeholder='Como você quer ser chamado?'
								icon={UserRound}
								value={form.nome}
								onChange={handleChange}
								required
							/>

							<AuthInputField
								id='cadastro-email'
								name='email'
								type='email'
								autoComplete='email'
								label='E-mail'
								placeholder='voce@gmail.com'
								icon={Mail}
								value={form.email}
								onChange={handleChange}
								required
							/>

							<div className='grid gap-4 sm:grid-cols-2'>
								<AuthInputField
									id='senha'
									name='senha'
									type={showPassword ? 'text' : 'password'}
									autoComplete='new-password'
									label='Senha'
									placeholder='Mín. 6 caracteres'
									icon={Lock}
									value={form.senha}
									onChange={handleChange}
									minLength={6}
									required
								/>

								<AuthInputField
									id='confirmarSenha'
									name='confirmarSenha'
									type={showPassword ? 'text' : 'password'}
									autoComplete='new-password'
									label='Confirmar senha'
									placeholder='Repita a senha'
									icon={Lock}
									value={form.confirmarSenha}
									onChange={handleChange}
									minLength={6}
									endAdornment={
										<PasswordToggle
											visible={showPassword}
											onToggle={() => setShowPassword((visible) => !visible)}
											label='senhas'
										/>
									}
									required
								/>
							</div>

							<AuthFormError message={errorMessage} />
							<AuthSubmitButton
								isLoading={isSubmitting}
								label='Criar minha conta'
								loadingLabel='Criando sua conta...'
							/>
						</form>

						<p className='mt-5 text-center text-sm text-[#64746f]'>
							Já possui uma conta?{' '}
							<Link
								to='/login'
								className='font-semibold text-[#2d5c43] hover:underline hover:underline-offset-4'
							>
								Entre por aqui
							</Link>
						</p>
					</AuthFormCard>
				</div>
			</section>
		</main>
	)
}
