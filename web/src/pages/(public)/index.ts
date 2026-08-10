import { redirect } from 'react-router'

import useAuthStore from 'src/store/authStore'

export function redirectAuthenticatedUser() {
	const isAuthenticated = useAuthStore.getState().isAuthenticated()

	return isAuthenticated ? redirect('/auth/explorar') : null
}
