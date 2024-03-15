import { describe, expect, it, afterEach, vi } from "vitest"
import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import ItemCard from "./ItemCard"
import { Item } from "../types/types"
import '@testing-library/jest-dom/vitest'
import { deleteItem } from "@/api/items"
import userEvent from "@testing-library/user-event"
import { currentItemContext } from "@/pages/ItemsPage"

vi.mock('@/api/items')

describe('item card', async () => {

    afterEach(() => {
        cleanup()
    })

    const queryClient = new QueryClient()

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const testItem: Item = { title: 'test', size: 4, id: '1' }
    const setCurrentItem = vi.fn()
    const setIsEditModalOpen = vi.fn()

    const renderComponent = () => {
        render(
            <currentItemContext.Provider value={{ currentItem: testItem, setCurrentItem, setIsEditModalOpen }}>
                <ItemCard item={testItem} />
            </currentItemContext.Provider>
            , {
                wrapper
            })
    }

    it('should render all parts', () => {
        renderComponent()

        expect(screen.getByText(testItem.size)).toBeInTheDocument()
        expect(screen.getByText(testItem.title)).toBeInTheDocument()
        expect(screen.getByLabelText('content')).toBeInTheDocument()
        expect(screen.getByLabelText('edit-button')).toBeInTheDocument()
        expect(screen.getByLabelText('delete-button')).toBeInTheDocument()
    })

    it('should be able to delete item with delete button', async () => {
        renderComponent()

        const user = userEvent.setup()
        const deleteButton = screen.getByLabelText('delete-button')
        await user.click(deleteButton)

        expect(deleteItem).toHaveBeenCalledWith(testItem)
    })

    it('should be able to click edit item with edit button', async () => {
        renderComponent()

        const user = userEvent.setup()
        const editButton = screen.getByLabelText('edit-button')
        await user.click(editButton)

        expect(setCurrentItem).toHaveBeenCalledWith(testItem)
        expect(setIsEditModalOpen).toHaveBeenCalledWith(true)
    })

})