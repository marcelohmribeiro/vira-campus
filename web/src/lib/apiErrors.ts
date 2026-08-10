import { isAxiosError } from 'axios'

import type { ApiErrorDetail, ApiErrorResponse } from 'src/types/api'

function readErrorMessage(value: unknown): string | null {
	if (typeof value === 'string') return value

	if (Array.isArray(value)) {
		const messages = value
			.map(readErrorMessage)
			.filter((message): message is string => Boolean(message))

		return messages.length > 0 ? messages.join(' ') : null
	}

	if (!value || typeof value !== 'object') return null

	const detail = value as ApiErrorDetail
	return detail.mensagem ?? detail.message ?? null
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
	if (!isAxiosError<ApiErrorResponse>(error)) return fallbackMessage

	const response = error.response?.data
	const responseMessage =
		readErrorMessage(response?.error) ??
		readErrorMessage(response?.details) ??
		readErrorMessage(response)

	if (responseMessage) return responseMessage

	if (error.code === 'ERR_NETWORK') {
		return 'Não foi possível conectar ao servidor. Verifique sua conexão.'
	}

	return fallbackMessage
}
