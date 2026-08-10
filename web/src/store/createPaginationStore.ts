import { create } from 'zustand'

import { getApiErrorMessage } from 'src/lib/apiErrors'

const PAGE_SIZE = 20

interface ItemWithId {
	id: number
}

interface PaginationState<Item, Filters> {
	items: Item[]
	page: number
	hasMore: boolean
	isLoading: boolean
	errorMessage: string
	loadPage: (filters: Filters, reset?: boolean) => Promise<void>
	removeItem: (id: number) => void
}

type PageLoader<Item, Filters> = (
	page: number,
	limit: number,
	filters: Filters,
) => Promise<Item[]>

export function createPaginationStore<Item extends ItemWithId, Filters>(
	pageLoader: PageLoader<Item, Filters>,
	fallbackError: string,
) {
	let latestRequest = 0

	return create<PaginationState<Item, Filters>>((set, get) => ({
		items: [],
		page: 1,
		hasMore: true,
		isLoading: false,
		errorMessage: '',

		loadPage: async (filters, reset = false) => {
			const state = get()
			if ((!reset && !state.hasMore) || (state.isLoading && !reset)) return

			const page = reset ? 1 : state.page
			const request = ++latestRequest

			set({
				isLoading: true,
				errorMessage: '',
				...(reset && { items: [], page: 1, hasMore: true }),
			})

			try {
				const items = await pageLoader(page, PAGE_SIZE, filters)
				if (request !== latestRequest) return

				set((current) => ({
					items: reset ? items : [...current.items, ...items],
					page: page + 1,
					hasMore: items.length === PAGE_SIZE,
				}))
			} catch (error) {
				if (request === latestRequest) {
					set({ errorMessage: getApiErrorMessage(error, fallbackError) })
				}
			} finally {
				if (request === latestRequest) set({ isLoading: false })
			}
		},

		removeItem: (id) => {
			set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
		},
	}))
}
