import { useState, type ImgHTMLAttributes, type ReactNode } from 'react'

interface ImageWithFallbackProps
	extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
	src?: string | null
	fallback: ReactNode
}

export function ImageWithFallback({
	src,
	fallback,
	onError,
	...props
}: ImageWithFallbackProps) {
	const [failedSrc, setFailedSrc] = useState<string | null>(null)

	if (!src || failedSrc === src) return fallback

	return (
		<img
			{...props}
			src={src}
			onError={(event) => {
				setFailedSrc(src)
				onError?.(event)
			}}
		/>
	)
}
