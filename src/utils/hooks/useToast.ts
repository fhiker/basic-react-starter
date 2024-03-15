import { ToastType, toastContext } from "@/contexts/toastContext";
import { useContext } from "react";

function useToast() {
	const { toasts, setToasts } = useContext(toastContext);

	function notify(message: string) {
		const id = Math.random();
		const newToast: ToastType = { message, type: "notify", id };
		setToasts((toasts) => [...toasts, newToast]);
		setTimeout(() => {
			setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
		}, 3000);
	}

	function warning(message: string) {
		const id = Math.random();
		const newToast: ToastType = { message, type: "warning", id };
		setToasts((toasts) => [...toasts, newToast]);
		setTimeout(() => {
			setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
		}, 3000);
	}

	function error(message: string) {
		console.log("TEST 1.2");
		const id = Math.random() * 10000;
		const newToast: ToastType = { message, type: "error", id };
		console.log("TEST 1.3");
		setToasts((toasts) => [...toasts, newToast]);

		console.log(toasts);
		setTimeout(() => {
			console.log("TEST 1.5");
			setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
		}, 3000);

		console.log("TEST 1.6");
	}

	function success(message: string) {
		const id = Math.random() * 10000;
		const newToast: ToastType = { message, type: "success", id };
		setToasts((toasts) => [...toasts, newToast]);
		setTimeout(() => {
			setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
		}, 3000);
	}

	return { notify, warning, error, success, toasts, setToasts };
}

export default useToast;
