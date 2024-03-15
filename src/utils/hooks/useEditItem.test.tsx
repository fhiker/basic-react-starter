import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_KEY_ITEMS } from "@/features/Item/consts";
import { beforeEach } from "node:test";
import { updateItem } from "@/api/items";
import { ReactNode } from "react";
import useUpdateItem from "./useEditItem";

vi.mock('@/api/items', () => {
    return {
        updateItem: vi.fn()
    }
})

describe("update Item", () => {

    const item = { title: "old", size: 5, id: "9" }
    const data = { title: 'new', size: 3, id: '9' }
    const queryClient = new QueryClient()

    beforeEach(() => { queryClient.setQueryData([CACHE_KEY_ITEMS], [item]) })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    it("should update item via optimistic update and leave it edited if api call succeeds", async () => {

        vi.mocked(updateItem).mockImplementationOnce(() => {
            return new Promise((resolve) => {
                resolve(data)
            })
        })

        queryClient.setQueryData([CACHE_KEY_ITEMS], [item])

        const { result } = renderHook(() => useUpdateItem(), { wrapper });

        expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([item])

        await result.current.mutate({ item, data })

        expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([data])

        await vi.waitFor(() => {
            return expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([data])
        }, { timeout: 550 })
    });

    it("should update item via optimistic update and return it api call fails", async () => {

        vi.mocked(updateItem).mockImplementationOnce(() => {
            return Promise.reject('Error')
        })

        queryClient.setQueryData([CACHE_KEY_ITEMS], [item])

        const { result } = renderHook(() => useUpdateItem(), { wrapper });

        expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([item])

        await result.current.mutate({ item, data })

        expect(queryClient.getQueryData([CACHE_KEY_ITEMS])).toStrictEqual([data])

        await vi.waitFor(() => {
            const queryData: { title: string }[] | undefined = queryClient.getQueryData([CACHE_KEY_ITEMS])
            return expect(queryData?.at(0)?.title).toBe('old')
        }, { timeout: 550 })
    });
});
