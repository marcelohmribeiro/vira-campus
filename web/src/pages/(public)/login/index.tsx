import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
	ArrowRight,
	BookOpen,
	Eye,
	EyeOff,
	GraduationCap,
	Leaf,
	Lock,
	Mail,
	Recycle,
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
import { useAuth } from 'src/hooks/auth'
import type { ApiErrorResponse } from 'src/types'
import { AxiosError } from 'axios'

interface CommunityBenefit {
	icon: ReactNode
	label: string
}

const communityBenefits: CommunityBenefit[] = [
	{ icon: <BookOpen className='size-4 text-[#b6ef67]' />, label: 'Livros e materiais' },
	{ icon: <GraduationCap className='size-4 text-[#b6ef67]' />, label: 'Feito para estudantes' },
	{ icon: <Leaf className='size-4 text-[#b6ef67]' />, label: 'Consumo consciente' },
]

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const { signin, isLoading } = useAuth()

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setErrorMessage('')

		try {
			await signin({ email, senha: password })
		} catch (error) {
			setErrorMessage(
				error.response?.data?.error ||
					'Não foi possível entrar agora. Confira seus dados e tente novamente.',
			)
		}
	}

	return (
		<main className='relative flex min-h-screen w-full flex-1 overflow-hidden bg-[#f7f8f2] text-[#173b32]'>
			<section className='relative hidden w-[52%] flex-col justify-between overflow-hidden bg-[#173b32] px-10 py-9 text-white lg:flex xl:px-16 xl:py-12'>
				<div
					aria-hidden='true'
					className='absolute -right-28 -top-28 size-80 rounded-full border border-white/10'
				/>
				<div
					aria-hidden='true'
					className='absolute -right-10 -top-10 size-80 rounded-full border border-white/10'
				/>
				<div
					aria-hidden='true'
					className='absolute bottom-0 left-0 h-44 w-full bg-[radial-gradient(circle_at_bottom_left,rgba(182,239,103,0.18),transparent_55%)]'
				/>

				<a href='/' className='relative z-10 flex w-fit items-center gap-3' aria-label='ViraCampus - início'>
					<span className='flex size-11 items-center justify-center rounded-2xl bg-[#b6ef67] text-[#173b32] shadow-[0_10px_30px_rgba(182,239,103,0.18)]'>
						<Recycle className='size-6' strokeWidth={2.4} />
					</span>
					<span className='text-xl font-semibold tracking-[-0.03em]'>ViraCampus</span>
				</a>

				<div className='relative z-10 max-w-xl py-12'>
					<div className='mb-7 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm'>
						<Leaf className='size-3.5 text-[#b6ef67]' />
						Economia circular dentro do campus
					</div>

					<h2 className='max-w-lg text-4xl leading-[1.08] font-semibold tracking-[-0.045em] xl:text-5xl'>
						O que você não usa pode{' '}
						<span className='text-[#b6ef67]'>transformar o semestre</span> de alguém.
					</h2>

					<p className='mt-6 max-w-md text-base leading-7 text-white/65'>
						Compre, venda ou doe itens para estudantes perto de você. Mais acesso, menos desperdício e uma comunidade que compartilha.
					</p>

					<div className='mt-9 flex flex-wrap gap-2.5'>
						{communityBenefits.map(({ icon, label }) => (
							<div
								key={label}
								className='flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white/80'
							>
								{icon}
								{label}
							</div>
						))}
					</div>
				</div>

				<div className='relative z-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-white/55'>
					<span className='flex size-9 items-center justify-center rounded-full bg-white/8'>
						<Recycle className='size-4 text-[#b6ef67]' />
					</span>
					<p>Recicle, compartilhe, transforme. Pequenas trocas fazem a diferença.</p>
				</div>
			</section>

			<section className='relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12'>
				<div
					aria-hidden='true'
					className='absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_right,rgba(182,239,103,0.22),transparent_55%)] lg:hidden'
				/>

				<div className='relative z-10 w-full max-w-[430px]'>
					<a href='/' className='mb-10 flex w-fit items-center gap-2.5 lg:hidden' aria-label='ViraCampus - início'>
						<span className='flex size-10 items-center justify-center rounded-xl bg-[#173b32] text-[#b6ef67]'>
							<Recycle className='size-5' strokeWidth={2.4} />
						</span>
						<span className='text-lg font-semibold tracking-[-0.03em]'>ViraCampus</span>
					</a>

					<Card className='gap-0 rounded-[28px] border-0 bg-white py-0 shadow-[0_24px_70px_rgba(23,59,50,0.11)] ring-1 ring-[#173b32]/6'>
						<CardHeader className='gap-2 px-6 pt-7 pb-5 sm:px-8 sm:pt-8'>
							<div className='mb-3 flex size-10 items-center justify-center rounded-xl bg-[#eaf8d7] text-[#2d5c43]'>
								<GraduationCap className='size-5' />
							</div>
							<CardTitle className='text-[1.75rem] leading-tight font-semibold tracking-[-0.04em] text-[#173b32]'>
								<h1>Que bom ter você de volta</h1>
							</CardTitle>
							<CardDescription className='leading-6 text-[#64746f]'>
								Entre para continuar movimentando boas ideias pelo campus.
							</CardDescription>
						</CardHeader>

						<CardContent className='px-6 pb-7 sm:px-8 sm:pb-8'>
							<form onSubmit={handleSubmit} className='space-y-5'>
								<div className='space-y-2'>
									<div className='gap-4'>
										<label htmlFor='email' className='text-sm font-medium text-[#29473f]'>
										E-mail
										</label>
									</div>
									<div className='relative'>
										<Mail className='pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-[#8a9a95]' />
										<Input
											id='email'
											name='email'
											type='email'
											autoComplete='email'
											placeholder='voce@gmail.com'
											value={email}
											onChange={(e: ChangeEvent<HTMLInputElement>) => {
												setEmail(e.target.value)
												setErrorMessage('')
											}}
											required
											className='h-12 rounded-xl border-[#dce4df] bg-[#fbfcf9] pr-4 pl-10.5 text-[#173b32] placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15'
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<div className='flex items-center justify-between gap-4'>
										<label htmlFor='password' className='text-sm font-medium text-[#29473f]'>
											Senha
										</label>
										<a
											href='mailto:suporte@viracampus.com.br?subject=Recuperar%20senha'
											className='text-xs font-semibold text-[#376a4d] transition-colors hover:text-[#173b32] hover:underline hover:underline-offset-4'
										>
											Esqueci minha senha
										</a>
									</div>
									<div className='relative'>
										<Lock className='pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-[#8a9a95]' />
										<Input
											id='password'
											name='password'
											type={showPassword ? 'text' : 'password'}
											autoComplete='current-password'
											placeholder='Digite sua senha'
											value={password}
											onChange={(e: ChangeEvent<HTMLInputElement>) => {
												setPassword(e.target.value)
												setErrorMessage('')
											}}
											required
											className='h-12 rounded-xl border-[#dce4df] bg-[#fbfcf9] pr-11 pl-10.5 text-[#173b32] placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15'
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => setShowPassword((visible) => !visible)}
											className='absolute top-1/2 right-1.5 size-9 -translate-y-1/2 rounded-lg text-[#71817c] hover:bg-[#edf3ec] hover:text-[#173b32]'
											aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
											aria-pressed={showPassword}
										>
											{showPassword ? <EyeOff /> : <Eye />}
										</Button>
									</div>
								</div>

								<label className='flex w-fit cursor-pointer items-center gap-2.5 text-sm text-[#64746f]'>
									<input
										type='checkbox'
										name='remember'
										className='size-4 rounded border-[#c8d3cc] accent-[#2d5c43]'
									/>
									Manter conectado neste dispositivo
								</label>

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
									disabled={isLoading}
									className='h-12 w-full rounded-xl bg-[#173b32] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,59,50,0.18)] hover:bg-[#234f43]'
								>
									{isLoading ? (
										<>
											<span className='size-4 animate-spin rounded-full border-2 border-white/35 border-t-white' />
											Entrando...
										</>
									) : (
										<>
											Entrar na minha conta
											<ArrowRight data-icon='inline-end' className='ml-1 size-4 transition-transform group-hover/button:translate-x-0.5' />
										</>
									)}
								</Button>
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
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	)
}
