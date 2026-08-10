import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
	ArrowLeft,
	ArrowRight,
	Check,
	CheckCircle2,
	Eye,
	EyeOff,
	GraduationCap,
	Leaf,
	Lock,
	Mail,
	Recycle,
	ShieldCheck,
	UserRound,
} from 'lucide-react'

import { Button } from 'src/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'src/components/ui/card'
import { Input } from 'src/components/ui/input'
import { getApiErrorMessage } from 'src/lib/apiErrors'
import { api } from 'src/services/_api'
import type { Usuario } from 'src/types'

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

export default function Cadastro() {
	const [form, setForm] = useState<CadastroForm>(initialForm)
	const [showPassword, setShowPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [createdUser, setCreatedUser] = useState<Usuario | null>(null)

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

			const { data } = await api.post<Usuario>('/users', {
				nome: form.nome,
				email: form.email,
				senha: form.senha,
			})

			setCreatedUser(data)
			setForm(initialForm)
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
			<section className='relative hidden w-[46%] shrink-0 flex-col justify-between overflow-hidden bg-[#173b32] px-10 py-9 text-white lg:flex xl:px-16 xl:py-12'>
				<div
					aria-hidden='true'
					className='absolute -top-24 -left-24 size-72 rounded-full border border-white/10'
				/>
				<div
					aria-hidden='true'
					className='absolute -top-10 -left-10 size-72 rounded-full border border-white/10'
				/>
				<div
					aria-hidden='true'
					className='absolute right-0 bottom-0 h-64 w-full bg-[radial-gradient(circle_at_bottom_right,rgba(182,239,103,0.2),transparent_58%)]'
				/>

				<Link to='/' className='relative z-10 flex w-fit items-center gap-3' aria-label='ViraCampus - início'>
					<span className='flex size-11 items-center justify-center rounded-2xl bg-[#b6ef67] text-[#173b32] shadow-[0_10px_30px_rgba(182,239,103,0.18)]'>
						<Recycle className='size-6' strokeWidth={2.4} />
					</span>
					<span className='text-xl font-semibold tracking-[-0.03em]'>ViraCampus</span>
				</Link>

				<div className='relative z-10 max-w-lg py-8'>
					<div className='mb-7 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm'>
						<Leaf className='size-3.5 text-[#b6ef67]' />
						Seu campus, uma comunidade
					</div>

					<h2 className='max-w-md text-4xl leading-[1.08] font-semibold tracking-[-0.045em] xl:text-5xl'>
						Entre para a comunidade que faz as coisas{' '}
						<span className='text-[#b6ef67]'>circularem.</span>
					</h2>

					<p className='mt-6 max-w-md text-base leading-7 text-white/65'>
						Crie sua conta gratuitamente e encontre um novo destino para livros, eletrônicos e materiais acadêmicos.
					</p>

					<div className='mt-9 space-y-3'>
						<div className='flex items-center gap-3 text-sm text-white/80'>
							<span className='flex size-7 items-center justify-center rounded-full bg-[#b6ef67]/12 text-[#b6ef67]'>
								<Check className='size-4' strokeWidth={2.5} />
							</span>
							Publique itens para venda ou doação
						</div>
						<div className='flex items-center gap-3 text-sm text-white/80'>
							<span className='flex size-7 items-center justify-center rounded-full bg-[#b6ef67]/12 text-[#b6ef67]'>
								<Check className='size-4' strokeWidth={2.5} />
							</span>
							Conecte-se com estudantes próximos
						</div>
						<div className='flex items-center gap-3 text-sm text-white/80'>
							<span className='flex size-7 items-center justify-center rounded-full bg-[#b6ef67]/12 text-[#b6ef67]'>
								<Check className='size-4' strokeWidth={2.5} />
							</span>
							Ajude a reduzir o desperdício no campus
						</div>
					</div>
				</div>

				<div className='relative z-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-white/55'>
					<span className='flex size-9 items-center justify-center rounded-full bg-white/8'>
						<ShieldCheck className='size-4 text-[#b6ef67]' />
					</span>
					<p>Seus dados protegidos e uma comunidade feita para boas trocas.</p>
				</div>
			</section>

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

						<Link to='/' className='flex items-center gap-2 lg:hidden' aria-label='ViraCampus - início'>
							<span className='flex size-9 items-center justify-center rounded-xl bg-[#173b32] text-[#b6ef67]'>
								<Recycle className='size-4.5' strokeWidth={2.4} />
							</span>
							<span className='font-semibold tracking-[-0.03em]'>ViraCampus</span>
						</Link>
					</div>

					<Card className='gap-0 rounded-[28px] border-0 bg-white py-0 shadow-[0_24px_70px_rgba(23,59,50,0.11)] ring-1 ring-[#173b32]/6'>
						{createdUser ? (
							<CardContent className='flex flex-col items-center px-7 py-12 text-center sm:px-12'>
								<div className='relative mb-6 flex size-20 items-center justify-center rounded-full bg-[#eaf8d7] text-[#2d5c43]'>
									<div className='absolute inset-0 animate-ping rounded-full bg-[#b6ef67]/20' />
									<CheckCircle2 className='relative size-9' strokeWidth={2} />
								</div>
								<h1 className='text-3xl font-semibold tracking-[-0.04em] text-[#173b32]'>
									Conta criada com sucesso!
								</h1>
								<p className='mt-3 max-w-sm leading-6 text-[#64746f]'>
									Boas-vindas, {createdUser.nome}. Agora você já pode entrar e começar a movimentar boas ideias pelo campus.
								</p>
								<Button
									asChild
									size='lg'
									className='mt-8 h-12 w-full rounded-xl bg-[#173b32] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,59,50,0.18)] hover:bg-[#234f43]'
								>
									<Link to='/login'>
										Ir para o login
										<ArrowRight data-icon='inline-end' className='ml-1 size-4' />
									</Link>
								</Button>
							</CardContent>
						) : (
							<>
								<CardHeader className='gap-2 px-6 pt-7 pb-5 sm:px-8 sm:pt-8'>
									<div className='mb-2 flex size-10 items-center justify-center rounded-xl bg-[#eaf8d7] text-[#2d5c43]'>
										<GraduationCap className='size-5' />
									</div>
									<CardTitle className='text-[1.75rem] leading-tight font-semibold tracking-[-0.04em] text-[#173b32]'>
										<h1>Crie sua conta</h1>
									</CardTitle>
									<CardDescription className='leading-6 text-[#64746f]'>
										Leva menos de um minuto para fazer parte do ViraCampus.
									</CardDescription>
								</CardHeader>

								<CardContent className='px-6 pb-7 sm:px-8 sm:pb-8'>
									<form onSubmit={handleSubmit} className='space-y-4'>
										<div className='space-y-2'>
											<label htmlFor='nome' className='text-sm font-medium text-[#29473f]'>
												Nome completo
											</label>
											<div className='relative mt-2'>
												<UserRound className='pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-[#8a9a95]' />
												<Input
													id='nome'
													name='nome'
													type='text'
													autoComplete='name'
													placeholder='Como você quer ser chamado?'
													value={form.nome}
													onChange={handleChange}
													required
													className='h-12 rounded-xl border-[#dce4df] bg-[#fbfcf9] pr-4 pl-10.5 text-[#173b32] placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15'
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<label htmlFor='cadastro-email' className='text-sm font-medium text-[#29473f]'>
												E-mail
											</label>
											<div className='relative mt-2'>
												<Mail className='pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-[#8a9a95]' />
												<Input
													id='cadastro-email'
													name='email'
													type='email'
													autoComplete='email'
													placeholder='voce@gmail.com'
													value={form.email}
													onChange={handleChange}
													required
													className='h-12 rounded-xl border-[#dce4df] bg-[#fbfcf9] pr-4 pl-10.5 text-[#173b32] placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15'
												/>
											</div>
										</div>

										<div className='grid gap-4 sm:grid-cols-2'>
											<div className='space-y-2'>
												<label htmlFor='senha' className='text-sm font-medium text-[#29473f]'>
													Senha
												</label>
												<div className='relative mt-2'>
													<Lock className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8a9a95]' />
													<Input
														id='senha'
														name='senha'
														type={showPassword ? 'text' : 'password'}
														autoComplete='new-password'
														placeholder='Mín. 6 caracteres'
														value={form.senha}
														onChange={handleChange}
														minLength={6}
														required
														className='h-12 rounded-xl border-[#dce4df] bg-[#fbfcf9] pr-10 pl-10 text-[#173b32] placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15'
													/>
												</div>
											</div>

											<div className='space-y-2'>
												<label htmlFor='confirmarSenha' className='text-sm font-medium text-[#29473f]'>
													Confirmar senha
												</label>
												<div className='relative mt-2'>
													<Lock className='pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8a9a95]' />
													<Input
														id='confirmarSenha'
														name='confirmarSenha'
														type={showPassword ? 'text' : 'password'}
														autoComplete='new-password'
														placeholder='Repita a senha'
														value={form.confirmarSenha}
														onChange={handleChange}
														minLength={6}
														required
														className='h-12 rounded-xl border-[#dce4df] bg-[#fbfcf9] pr-10 pl-10 text-[#173b32] placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15'
													/>
													<Button
														type='button'
														variant='ghost'
														size='icon'
														onClick={() => setShowPassword((visible) => !visible)}
														className='absolute top-1/2 right-1 size-9 -translate-y-1/2 rounded-lg text-[#71817c] hover:bg-[#edf3ec] hover:text-[#173b32]'
														aria-label={showPassword ? 'Ocultar senhas' : 'Mostrar senhas'}
														aria-pressed={showPassword}
													>
														{showPassword ? <EyeOff /> : <Eye />}
													</Button>
												</div>
											</div>
										</div>

										{errorMessage && (
											<div
												role='alert'
												className='rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700'
											>
												{errorMessage}
											</div>
										)}

										<Button
											type='submit'
											size='lg'
											disabled={isSubmitting}
											className='h-12 w-full rounded-xl bg-[#173b32] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,59,50,0.18)] hover:bg-[#234f43]'
										>
											{isSubmitting ? (
												<>
													<span className='size-4 animate-spin rounded-full border-2 border-white/35 border-t-white' />
													Criando sua conta...
												</>
											) : (
												<>
													Criar minha conta
													<ArrowRight data-icon='inline-end' className='ml-1 size-4 transition-transform group-hover/button:translate-x-0.5' />
												</>
											)}
										</Button>
									</form>

									<p className='mt-5 text-center text-sm text-[#64746f]'>
										Já possui uma conta?{' '}
										<Link to='/login' className='font-semibold text-[#2d5c43] hover:underline hover:underline-offset-4'>
											Entre por aqui
										</Link>
									</p>
								</CardContent>
							</>
						)}
					</Card>
				</div>
			</section>
		</main>
	)
}
