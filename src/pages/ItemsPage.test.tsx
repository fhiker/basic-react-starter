import { describe, expect, it, afterEach, vi } from "vitest"
import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import '@testing-library/jest-dom/vitest'
import userEvent from "@testing-library/user-event"
import ItemsPage from "@/pages/ItemsPage"

vi.mock('@/api/items')

describe('item card', async () => {

    afterEach(() => {
        cleanup()
    })

    const queryClient = new QueryClient()

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const renderComponent = () => {
        render(
            <>
                <ItemsPage />
            </>

            , { wrapper })
    }

    it('should render add button', () => {
        renderComponent()

        expect(screen.getByLabelText('add-button')).toBeInTheDocument()

    })

    it('on click on add button, should show create item modal', async () => {
        renderComponent()

        const user = userEvent.setup()

        await user.click(screen.getByLabelText('add-button'))

        expect(screen.getByText('Create new item')).toBeInTheDocument()

    })
})