import type { ComponentProps, ReactNode } from 'react'
import { ArrowRight, Eye, EyeOff, GraduationCap, type LucideIcon } from 'lucide-react'

import { Button } from 'src/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'src/components/ui/card'
import { Input } from 'src/components/ui/input'
import { cn } from 'src/lib/utils'

interface AuthFormCardProps {
	title: string
	description: string
	children: ReactNode
}

export function AuthFormCard({ title, description, children }: AuthFormCardProps) {
	return (
		<Card className='gap-0 rounded-[28px] border-0 bg-white py-0 shadow-[0_24px_70px_rgba(23,59,50,0.11)] ring-1 ring-[#173b32]/6'>
			<CardHeader className='gap-2 px-6 pt-7 pb-5 sm:px-8 sm:pt-8'>
				<div className='mb-2 flex size-10 items-center justify-center rounded-xl bg-[#eaf8d7] text-[#2d5c43]'>
					<GraduationCap className='size-5' />
				</div>
				<CardTitle className='text-[1.75rem] leading-tight font-semibold tracking-[-0.04em] text-[#173b32]'>
					<h1>{title}</h1>
				</CardTitle>
				<CardDescription className='leading-6 text-[#64746f]'>
					{description}
				</CardDescription>
			</CardHeader>

			<CardContent className='px-6 pb-7 sm:px-8 sm:pb-8'>{children}</CardContent>
		</Card>
	)
}

interface AuthInputFieldProps extends Omit<ComponentProps<typeof Input>, 'className'> {
	label: string
	icon: LucideIcon
	labelAction?: ReactNode
	endAdornment?: ReactNode
	className?: string
}

export function AuthInputField({
	label,
	icon: Icon,
	labelAction,
	endAdornment,
	className,
	id,
	...inputProps
}: AuthInputFieldProps) {
	return (
		<div className='space-y-2'>
			<div className={cn(labelAction && 'flex items-center justify-between gap-4')}>
				<label htmlFor={id} className='text-sm font-medium text-[#29473f]'>
					{label}
				</label>
				{labelAction}
			</div>

			<div className='relative'>
				<Icon aria-hidden='true' className='pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-[#8a9a95]' />
				<Input
					id={id}
					className={cn(
						'h-12 rounded-xl border-[#dce4df] bg-[#fbfcf9] pl-10.5 text-[#173b32] placeholder:text-[#9aa7a3] focus-visible:border-[#4f7c61] focus-visible:ring-[#4f7c61]/15',
						endAdornment ? 'pr-11' : 'pr-4',
						className,
					)}
					{...inputProps}
				/>
				{endAdornment}
			</div>
		</div>
	)
}

interface PasswordToggleProps {
	visible: boolean
	onToggle: () => void
	label?: string
}

export function PasswordToggle({ visible, onToggle, label = 'senha' }: PasswordToggleProps) {
	return (
		<Button
			type='button'
			variant='ghost'
			size='icon'
			onClick={onToggle}
			aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
			aria-pressed={visible}
			className='absolute top-1/2 right-1.5 size-9 -translate-y-1/2 rounded-lg text-[#71817c] hover:bg-[#edf3ec] hover:text-[#173b32]'
		>
			{visible ? <EyeOff aria-hidden='true' /> : <Eye aria-hidden='true' />}
		</Button>
	)
}

export function AuthFormError({ message }: { message: string }) {
	if (!message) return null

	return (
		<div
			role='alert'
			className='rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700'
		>
			{message}
		</div>
	)
}

interface AuthSubmitButtonProps {
	isLoading: boolean
	label: string
	loadingLabel: string
}

export function AuthSubmitButton({
	isLoading,
	label,
	loadingLabel,
}: AuthSubmitButtonProps) {
	return (
		<Button
			type='submit'
			size='lg'
			disabled={isLoading}
			className='h-12 w-full rounded-xl bg-[#173b32] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(23,59,50,0.18)] hover:bg-[#234f43]'
		>
			{isLoading ? (
				<>
					<span aria-hidden='true' className='size-4 animate-spin rounded-full border-2 border-white/35 border-t-white' />
					{loadingLabel}
				</>
			) : (
				<>
					{label}
					<ArrowRight aria-hidden='true' className='ml-1 size-4 transition-transform group-hover/button:translate-x-0.5' />
				</>
			)}
		</Button>
	)
}
