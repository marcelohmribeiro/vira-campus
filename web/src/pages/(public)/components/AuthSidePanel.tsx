import type { ReactNode } from 'react'
import { Leaf, type LucideIcon } from 'lucide-react'

import { AuthBrand } from './AuthBrand'
import { cn } from 'src/lib/utils'

type PanelVariant = 'login' | 'cadastro'

interface AuthFeature {
	icon: LucideIcon
	label: string
}

interface AuthSidePanelProps {
	variant: PanelVariant
	eyebrow: string
	title: ReactNode
	description: string
	features: AuthFeature[]
}

export function AuthSidePanel({
	variant,
	eyebrow,
	title,
	description,
	features,
}: AuthSidePanelProps) {
	const isLogin = variant === 'login'

	return (
		<section
			className={cn(
				'relative hidden flex-col overflow-hidden bg-[#173b32] px-10 py-9 text-white lg:flex xl:px-16 xl:py-12',
				isLogin ? 'w-[52%]' : 'w-[46%] shrink-0',
			)}
		>
			<PanelDecoration variant={variant} />
			<AuthBrand className='relative z-10' />

			<div className={cn('relative z-10 flex flex-1 flex-col justify-center', isLogin ? 'max-w-xl' : 'max-w-lg')}>
				<div className='mb-7 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm'>
					<Leaf className='size-3.5 text-[#b6ef67]' />
					{eyebrow}
				</div>

				<h2
					className={cn(
						'text-4xl leading-[1.08] font-semibold tracking-[-0.045em] xl:text-5xl',
						isLogin ? 'max-w-lg' : 'max-w-md',
					)}
				>
					{title}
				</h2>

				<p className='mt-6 max-w-md text-base leading-7 text-white/65'>{description}</p>
				<FeatureList features={features} variant={variant} />
			</div>

		</section>
	)
}

function FeatureList({ features, variant }: Pick<AuthSidePanelProps, 'features' | 'variant'>) {
	if (variant === 'login') {
		return (
			<div className='mt-9 flex flex-wrap gap-2.5'>
				{features.map(({ icon: Icon, label }) => (
					<div
						key={label}
						className='flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white/80'
					>
						<Icon aria-hidden='true' className='size-4 text-[#b6ef67]' />
						{label}
					</div>
				))}
			</div>
		)
	}

	return (
		<div className='mt-9 space-y-3'>
			{features.map(({ icon: Icon, label }) => (
				<div key={label} className='flex items-center gap-3 text-sm text-white/80'>
					<span className='flex size-7 shrink-0 items-center justify-center rounded-full bg-[#b6ef67]/12 text-[#b6ef67]'>
						<Icon aria-hidden='true' className='size-4' strokeWidth={2.5} />
					</span>
					{label}
				</div>
			))}
		</div>
	)
}

function PanelDecoration({ variant }: { variant: PanelVariant }) {
	if (variant === 'login') {
		return (
			<>
				<div aria-hidden='true' className='absolute -top-28 -right-28 size-80 rounded-full border border-white/10' />
				<div aria-hidden='true' className='absolute -top-10 -right-10 size-80 rounded-full border border-white/10' />
			</>
		)
	}

	return (
		<>
			<div aria-hidden='true' className='absolute -top-24 -left-24 size-72 rounded-full border border-white/10' />
			<div aria-hidden='true' className='absolute -top-10 -left-10 size-72 rounded-full border border-white/10' />
		</>
	)
}
