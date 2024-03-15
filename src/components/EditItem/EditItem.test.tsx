import { cleanup, render, screen } from '@testing-library/react'
import { vi, describe, it, expect, afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import EditItem from './EditItem'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { currentItemContext } from '@/pages/ItemsPage'
import { Item } from '@/features/Item/types/types'
import { updateItem } from '@/api/items'

vi.mock('@/api/items')

describe('edit item form', () => {
    afterEach(() => {
        cleanup()
    })
    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const currentItem: Item = { title: 'test', size: 4, id: '1' }
    const setCurrentItem = () => { }
    const setIsEditModalOpen = () => { }

    const renderComponent = () => {
        render(
            <currentItemContext.Provider value={{ setCurrentItem, setIsEditModalOpen, currentItem }}>
                <EditItem />
            </currentItemContext.Provider>, {
            wrapper
        })

        return { waitForFormToLoad: () => screen.findByRole('form') }
    }
    const queryClient = new QueryClient()

    it('should display all fields', async () => {
        const { waitForFormToLoad } = renderComponent()

        await waitForFormToLoad()
        expect(screen.getByLabelText('title')).toBeInTheDocument()
        expect(screen.getByLabelText('size')).toBeInTheDocument()
        expect(screen.getByLabelText('submit')).toBeInTheDocument()
    })

    it('should display all fields with initial values', async () => {
        const { waitForFormToLoad } = renderComponent()

        await waitForFormToLoad()

        expect(screen.getByLabelText('title')).toHaveValue(currentItem.title)
        expect(screen.getByLabelText('size')).toHaveValue(currentItem.size)
    })

    it('should dispaly error if title is reduced to 2 or less characters', async () => {
        const { waitForFormToLoad } = renderComponent()

        await waitForFormToLoad()

        const titleInput = screen.getByLabelText('title')
        const sizeInput = screen.getByLabelText('size')
        const user = userEvent.setup()

        await user.type(titleInput, '{backspace}{backspace}')
        await user.click(sizeInput)

        expect(screen.getByLabelText('title-error')).toBeInTheDocument()
    })

    it('should dispaly error if size is reduced to less than 5', async () => {
        const { waitForFormToLoad } = renderComponent()

        await waitForFormToLoad()

        const titleInput = screen.getByLabelText('title')
        const sizeInput = screen.getByLabelText('size')
        const user = userEvent.setup()

        await user.type(sizeInput, '{backspace}2')
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

        const data = { title: 'testtest', size: 46 }

        expect(updateItem).toHaveBeenCalledWith(currentItem, data)
    })
})