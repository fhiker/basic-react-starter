import useDeleteItem from "./useDeleteItem";
import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_KEY_ITEMS } from "@/features/Item/consts";
import { beforeEach } from "node:test";
import { deleteItem } from "@/api/items";
import { ReactNode } from "react";

vi.mock('@/api/items', () => {
	return {
		deleteItem: vi.fn()
	}
})

describe("deleteItem", () => {

	const item = { title: "str", size: 5, id: "9" };
	const queryClient = new QueryClient()

	beforeEach(() => { queryClient.setQueryData([CACHE_KEY_ITEMS], [item]) })

	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)

	it("should delete item via optimistic update and leave it removed if api calll succeeds", async () => {

		vi.mocked(deleteItem).mockImplementationOnce(() => {
			return new Promise((resolve) => {
				resolve(item.id)
			})
		}
		)
		const { result } = renderHook(() => useDeleteItem(), { wrapper });

		queryClient.setQueryData([CACHE_KEY_ITEMS], [item])

		expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([item])

		await result.current.mutate(item)

		expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([])

		await vi.waitFor(() => {
			return expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([])
		}, { timeout: 550 })
	});

	it("should delete item via optimistic update and put it back if api calll fails", async () => {
		vi.mocked(deleteItem).mockImplementationOnce(() => {
			throw new Error('Error');
		})

		const { result } = renderHook(() => useDeleteItem(), { wrapper });
		queryClient.setQueryData([CACHE_KEY_ITEMS], [item])

		expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([item])

		await result.current.mutate(item)

		expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([])

		await vi.waitFor(() => {
			return expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([item])
		}, { timeout: 550 })

	});
});
