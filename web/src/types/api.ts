export interface ApiErrorDetail {
	code?: string
	message?: string
	mensagem?: string
}

export interface ApiErrorResponse {
	error?: string | ApiErrorDetail | ApiErrorDetail[]
	message?: string
	details?: ApiErrorDetail[]
}
