import { Recycle } from 'lucide-react'
import { cn } from 'src/lib/utils'

type BrandSize = 'compact' | 'mobile' | 'desktop'

interface AuthBrandProps {
	size?: BrandSize
	className?: string
}

const brandStyles: Record<BrandSize, { icon: string; logo: string; text: string }> = {
	compact: {
		icon: 'size-4.5',
		logo: 'size-9 rounded-xl bg-[#173b32] text-[#b6ef67]',
		text: 'text-base',
	},
	mobile: {
		icon: 'size-5',
		logo: 'size-10 rounded-xl bg-[#173b32] text-[#b6ef67]',
		text: 'text-lg',
	},
	desktop: {
		icon: 'size-6',
		logo: 'size-11 rounded-2xl bg-[#b6ef67] text-[#173b32] shadow-[0_10px_30px_rgba(182,239,103,0.18)]',
		text: 'text-xl',
	},
}

export function AuthBrand({ size = 'desktop', className }: AuthBrandProps) {
	const styles = brandStyles[size]

	return (
		<div className={cn('flex w-fit items-center gap-2.5', className)}>
			<span
				className={cn(
					'flex shrink-0 items-center justify-center',
					styles.logo,
				)}
			>
				<Recycle aria-hidden='true' className={styles.icon} strokeWidth={2.4} />
			</span>
			<span className={cn('font-semibold tracking-[-0.03em]', styles.text)}>
				ViraCampus
			</span>
		</div>
	)
}
