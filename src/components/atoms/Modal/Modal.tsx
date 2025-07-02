import React, { useRef, ReactNode, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
};

type ModalSectionProps = {
  children: ReactNode;
  className?: string;
  dataTestid?: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleClickOutside: React.MouseEventHandler<HTMLDivElement> = (
    event
  ) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 "
          onClick={handleClickOutside}
        >
          <dialog
            ref={dialogRef}
            className="rounded-lg bg-white  p-4  shadow-xl mt-[67px]"
            open
          >
            <button
              className="absolute text-gray-600 top-2 right-2 hover:text-gray-800"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="mt-4">{children}</div>
          </dialog>
        </div>
      )}
    </>
  );
};

export const ModalHeader: React.FC<ModalSectionProps> = ({
  children,
  className,
  dataTestid,
}) => (
  <div
    className={`border-b pb-2 mb-4 text-lg font-bold ${className}`}
    data-testid={dataTestid}
  >
    {children}
  </div>
);

export const ModalBody: React.FC<ModalSectionProps> = ({
  children,
  className,
}) => <div className={`my-4 w-96 ${className}`}>{children}</div>;

export const ModalFooter: React.FC<ModalSectionProps> = ({
  children,
  className,
}) => (
  <div className={`border-t pt-2 mt-4 text-right ${className}`}>{children}</div>
);

export default Modal;
