import React, { useEffect, useRef } from "react";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  header: React.ReactNode;
  body: React.ReactNode;
  width?: string;
  height?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  closeOnClickOutside = true,
  closeOnEsc = true,
  header,
  body,
  width = "80%",
  height = "auto"
}) => {
  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (closeOnEsc && open && e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyPress);
    return () => window.removeEventListener("keydown", onKeyPress);
  }, [closeOnEsc, onClose, open]);

  const container = useRef<HTMLDivElement>(null);
  const onOverlayClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && !container.current?.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-10 p-8 bg-gray-600/90",
        `${open ? "visible" : "invisible"}`
      )}
      onClick={onOverlayClick}
    >
      <div
        className="relative p-4 mx-auto mt-[100px]"
        ref={container}
        style={{ width, height }}
      >
        <button
          className="absolute -top-2 -right-2 flex justify-center rounded-full h-8 w-8cursor-pointer shadow-xl"
          onClick={onClose}
          title="Close"
        >
          <span className="text-2xl leading-7 select-none">&times;</span>
        </button>
        <div className="overflow-hidden bg-background rounded shadow-xl">
          <div className="block p-4 text-typography">
            <h1 className="text-lg text-typography">{header}</h1>
          </div>
          <div className="p-4">{body}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
