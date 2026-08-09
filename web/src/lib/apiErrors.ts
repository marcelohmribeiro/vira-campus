import { isAxiosError } from 'axios'

interface ApiErrorDetail {
	mensagem?: string
	message?: string
}

interface ApiErrorResponse {
	error?: string | ApiErrorDetail[]
	details?: ApiErrorDetail[]
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
	if (!isAxiosError<ApiErrorResponse>(error)) return fallbackMessage

	const response = error.response?.data
	if (typeof response?.error === 'string') return response.error

	const details = response?.details ?? response?.error
	if (Array.isArray(details)) {
		const messages = details
			.map((detail) => detail.mensagem ?? detail.message)
			.filter((message): message is string => Boolean(message))

		if (messages.length > 0) return messages.join(' ')
	}

	if (error.code === 'ERR_NETWORK') {
		return 'Não foi possível conectar ao servidor. Verifique sua conexão.'
	}

	return fallbackMessage
}
