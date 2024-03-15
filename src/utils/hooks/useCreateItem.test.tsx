import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_KEY_ITEMS } from "@/features/Item/consts";
import { beforeEach } from "node:test";
import { createItem } from "@/api/items";
import useCreateItem from "./useCreateItem";
import { ReactNode } from "react";

vi.mock('@/api/items', () => {
	return {
		createItem: vi.fn()
	}
})

describe("create Item", () => {

	const item = { title: "str", size: 5, id: "9" };
	const queryClient = new QueryClient()

	beforeEach(() => {
		queryClient.setQueryData([CACHE_KEY_ITEMS], [])
		vi.resetAllMocks()
	})


	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)

	it("should create item and call resetQueries", async () => {
		const spy = vi.spyOn(queryClient, 'resetQueries')

		vi.mocked(createItem).mockImplementationOnce(() => {
			return new Promise((resolve) => {
				resolve(item)
			})
		}
		)
		const { result } = renderHook(() => useCreateItem(), { wrapper });

		await result.current.mutate(item)

		await vi.waitFor(() => {
			return (
				expect(spy).toHaveBeenCalledTimes(1)
			)
		}, { timeout: 550 })
	});

	it("should throw error thus not calling resetQueries", async () => {
		const spy = vi.spyOn(queryClient, 'resetQueries')

		vi.mocked(createItem).mockImplementationOnce(() => {
			return Promise.reject('Error')
		})
		const { result } = renderHook(() => useCreateItem(), { wrapper });

		await result.current.mutate(item)

		await vi.waitFor(() => {
			return expect(spy).toHaveBeenCalledTimes(0)
		}, { timeout: 550 })

	});

});
