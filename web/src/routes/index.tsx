import { createBrowserRouter } from 'react-router'

import Cadastro from 'src/pages/(public)/cadastro'
import Login from 'src/pages/(public)/login'
import Explorar from 'src/pages/auth/explorar'
import DetalhesAnuncio from 'src/pages/auth/detalhesAnuncio'
import EditarAnuncio from 'src/pages/auth/editarAnuncio'
import AuthLayout from 'src/pages/auth/layout'
import MeusAnuncios from 'src/pages/auth/meusAnuncios'
import NovoAnuncio from 'src/pages/auth/novoAnuncio'
import Perfil from 'src/pages/auth/perfil'
import Index from 'src/pages'
import Layout from 'src/pages/layout'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ index: true, element: <Index /> },
			{ path: 'login', element: <Login /> },
			{ path: 'cadastro', element: <Cadastro /> },
			{
				path: 'auth',
				element: <AuthLayout />,
				children: [
					{ path: 'explorar', element: <Explorar /> },
					{ path: 'meus-anuncios', element: <MeusAnuncios /> },
					{ path: 'meus-anuncios/:id/editar', element: <EditarAnuncio /> },
					{ path: 'anuncios/novo', element: <NovoAnuncio /> },
					{ path: 'anuncios/:id', element: <DetalhesAnuncio /> },
					{ path: 'perfil', element: <Perfil /> },
					{ path: 'configuracoes', element: <h1>Configurações</h1> },
				],
			},
		],
	},
])
