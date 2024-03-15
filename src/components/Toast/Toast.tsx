import useToast from '@/utils/hooks/useToast'

const Toast = () => {
    const toast = useToast()
    return (
        toast.toasts[0] && toast.toasts.map((toast) => (
            <div key={`toast-${toast.id}`} className={`toast toast-${toast.type}`}>{toast.message}</div>
        ))
    )
}

export default Toast