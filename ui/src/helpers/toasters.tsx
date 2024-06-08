import { toast, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastOptions {
  message: string;
  position?: ToastPosition;
  autoClose?: number;
}

const defaultPosition: ToastPosition = "top-right"; // Default position if not specified

function successToast({ message, position = defaultPosition, autoClose }: ToastOptions): void {
  toast.success(message, {
    position,
    autoClose
  });
}

function warningToast({ message, position = defaultPosition, autoClose }: ToastOptions): void {
  toast.warn(message, {
    position,
    autoClose
  });
}

function infoToast({ message, position = defaultPosition, autoClose = 300 }: ToastOptions): void {
  toast.info(message, {
    position,
    autoClose
  });
}

function errorToast({ message, position = defaultPosition, autoClose }: ToastOptions): void {
  toast.error(message, {
    position,
    autoClose
  });
}

function loaderOverlay(): object {
  return {
    overlay: (base: any) => ({
      ...base,
      background: 'transparent'
    }),
    spinner: (base: any) => ({
      ...base,
      width: '100px',
      '& svg circle': {
        stroke: 'rgba(33, 29, 29, 0.5)'
      }
    })
  };
}

const Toast = {
  successToast,
  warningToast,
  infoToast,
  errorToast,
  loaderOverlay
};

export default Toast;
