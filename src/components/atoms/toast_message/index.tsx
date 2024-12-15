import { toast, ToastOptions, ToastPosition } from "react-toastify";

export const toastMessage = (
  message: string | undefined,
  messageType: "success" | "error"
) => {
  const toastConfig: ToastOptions<ToastPosition> = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (messageType) {
    case "success":
      toast.success(message, toastConfig);
      break;
    case "error":
      toast.error(message, toastConfig);
      break;
    default:
      toast.info(message, toastConfig);
  }
};
