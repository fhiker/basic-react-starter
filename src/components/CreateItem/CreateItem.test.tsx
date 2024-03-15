import { cleanup, render, screen } from '@testing-library/react'
import { vi, describe, it, expect, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import CreateItem from './CreateItem'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { createItem } from '@/api/items'

vi.mock('@/api/items')

describe('create item form', () => {

    afterEach(() => {
        cleanup()
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const queryClient = new QueryClient()

    const renderComponent = () => {
        render(<CreateItem onClose={vi.fn()} />, {
            wrapper
        })

        return { waitForFormToLoad: () => screen.findByRole('form') }
    }

    it('should display all fields', async () => {

        const { waitForFormToLoad } = renderComponent()

        await waitForFormToLoad()

        expect(screen.getByLabelText('title')).toBeInTheDocument()
        expect(screen.getByLabelText('size')).toBeInTheDocument()
        expect(screen.getByLabelText('submit')).toBeInTheDocument()
    })

    it('should dispaly error if title is missing or less than 3 characters', async () => {
        const { waitForFormToLoad } = renderComponent()

        await waitForFormToLoad()

        const titleInput = screen.getByLabelText('title')
        const sizeInput = screen.getByLabelText('size')
        const user = userEvent.setup()

        await user.type(titleInput, 'er')
        await user.click(sizeInput)

        expect(screen.getByLabelText('title-error')).toBeInTheDocument()
    })

    it('should dispaly error if size is less than 5', async () => {
        const { waitForFormToLoad } = renderComponent()

        await waitForFormToLoad()

        const sizeInput = screen.getByLabelText('size')
        const titleInput = screen.getByLabelText('title')
        const user = userEvent.setup()

        await user.type(sizeInput, '2')
        await user.click(titleInput)

        expect(screen.getByLabelText('size-error')).toBeInTheDocument()
    })

    it('should submit if validation succeeds', async () => {
        const { waitForFormToLoad } = renderComponent()

        await waitForFormToLoad()

        const titleInput = screen.getByLabelText('title')
        const sizeInput = screen.getByLabelText('size')
        const user = userEvent.setup()

        await user.type(titleInput, 'test')
        await user.type(sizeInput, '6')
        await user.click(screen.getByLabelText('submit'))

        expect(createItem).toHaveBeenCalledWith({ title: 'test', size: 6 })
    })
})