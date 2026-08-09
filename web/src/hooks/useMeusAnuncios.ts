import { useEffect, useState } from 'react'

import { getApiErrorMessage } from 'src/lib/apiErrors'
import { listarMeusAnuncios } from 'src/services'
import type { Anuncio } from 'src/types'

export function useMeusAnuncios() {
	const [anuncios, setAnuncios] = useState<Anuncio[]>([])
	const [errorMessage, setErrorMessage] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [reloadCount, setReloadCount] = useState(0)

	useEffect(() => {
		const controller = new AbortController()

		async function loadAnuncios() {
			try {
				setIsLoading(true)
				setErrorMessage('')
				setAnuncios(await listarMeusAnuncios({ signal: controller.signal }))
			} catch (error) {
				if (controller.signal.aborted) return
				setErrorMessage(
					getApiErrorMessage(error, 'Não foi possível carregar seus anúncios.'),
				)
			} finally {
				if (!controller.signal.aborted) setIsLoading(false)
			}
		}

		void loadAnuncios()
		return () => controller.abort()
	}, [reloadCount])

	function reload() {
		setReloadCount((count) => count + 1)
	}

	function removeFromList(anuncioId: number) {
		setAnuncios((current) => current.filter((anuncio) => anuncio.id !== anuncioId))
	}

	return { anuncios, errorMessage, isLoading, reload, removeFromList }
}
