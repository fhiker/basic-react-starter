import { describe, expect, it, afterEach, vi } from "vitest"
import { cleanup, render, renderHook, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { Item } from "../types/types"
import '@testing-library/jest-dom/vitest'
import { getAllItems } from "@/api/items"
import ItemList from "./ItemList"
import useItems from "@/utils/hooks/useItems"

vi.mock("@/api/items", () => {
    return {
        getAllItems: vi.fn()
    }
})

describe('item list', async () => {

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                // ✅ turns retries off
                retry: false,
            },
        },
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    afterEach(() => {
        cleanup()
        vi.resetAllMocks()
        queryClient.resetQueries()
    })


    const testItems: Item[] = [
        { title: 'test1', size: 4, id: '1' },
        { title: 'test2', size: 2, id: '2' },
        { title: 'test3', size: 7, id: '3' }
    ]

    const renderComponent = () => {
        render(
            <ItemList />
            , {
                wrapper
            })

        return { waitForItemsToLoad: () => screen.findByText('test1') }
    }

    it('should render all parts', async () => {
        vi.mocked(getAllItems).mockImplementationOnce(() => {
            return Promise.resolve(testItems)
        })

        const { waitForItemsToLoad } = renderComponent()

        await waitForItemsToLoad

        const { result } = renderHook(() => useItems(10), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 500 })

        expect(getAllItems).toReturnWith(testItems)
        expect(getAllItems).toHaveBeenCalledWith({
            params: {
                limit: 10,
            },
        })

        expect(screen.getByText('List Items')).toBeInTheDocument()

        expect(screen.getByText('test1')).toBeInTheDocument()
        expect(screen.getByText('test2')).toBeInTheDocument()
        expect(screen.getByText('test3')).toBeInTheDocument()
    })

    it('should show error if error occurred', async () => {
        vi.mocked(getAllItems).mockImplementation(() => {
            throw new Error('error fetching items')
        }
        )

        const { waitForItemsToLoad } = renderComponent()

        await waitForItemsToLoad

        const { result } = renderHook(() => useItems(10), { wrapper })
        console.log({ ...result.current })

        await waitFor(() => expect(result.current.isError).toBe(true))
        console.log({ ...result.current })

        expect(screen.getByText('error fetching items')).toBeInTheDocument()

    })
})