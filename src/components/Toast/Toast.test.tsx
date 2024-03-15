import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ToastType, toastContext } from "@/contexts/toastContext";
import Toast from "./Toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import '@testing-library/jest-dom/vitest'
import { beforeEach } from "node:test";


describe('toast', () => {

    beforeEach(() => { cleanup() })
    const queryClient = new QueryClient()

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const toasts: ToastType[] = [
        { message: 'toast 1', type: "error", id: 1 },
        { message: 'toast 2', type: "notify", id: 2 },
        { message: 'toast 3', type: "warning", id: 3 },
        { message: 'toast 4', type: "success", id: 4 },
    ]
    const setToasts = () => { }

    const renderComponent = () => {
        render(
            <toastContext.Provider value={{ toasts, setToasts }}>
                <Toast />
            </toastContext.Provider>, {
            wrapper
        })

        return { waitForToastToLoad: () => screen.getByText('toast 1') }
    }

    it('should show all toasts', async () => {

        const { waitForToastToLoad } = renderComponent()

        await waitForToastToLoad()

        expect(screen.getByText('toast 1')).toBeInTheDocument()
        expect(screen.getByText('toast 2')).toBeInTheDocument()
        expect(screen.getByText('toast 3')).toBeInTheDocument()
        expect(screen.getByText('toast 4')).toBeInTheDocument()
    })
})