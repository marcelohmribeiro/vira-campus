import { useEffect, useRef } from 'react'

export function useInfiniteScroll(onLoad: () => void, enabled: boolean) {
	const targetRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const target = targetRef.current
		if (!target || !enabled) return

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) onLoad()
		}, { rootMargin: '300px' })

		observer.observe(target)
		return () => observer.disconnect()
	}, [enabled, onLoad])

	return targetRef
}
