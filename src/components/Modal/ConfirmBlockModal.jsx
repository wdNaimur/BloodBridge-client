import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";

const ConfirmBlockModal = ({ isOpen, close, onConfirm, user, isLoading }) => {
  const isBlocking = user?.status === "active";
  const newStatus = isBlocking ? "Block" : "Unblock";

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-xl bg-secondary/90 p-6 backdrop-blur-2xl">
            <DialogTitle
              as="h3"
              className="text-base font-medium text-base-100"
            >
              {newStatus}{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-bold">
                {user?.name}
              </span>
              ?
            </DialogTitle>
            <p className="text-sm mt-2 text-base-100">
              Are you sure you want to {isBlocking ? "block" : "unblock"} this
              user?
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={onConfirm}
                className={clsx(
                  "btn rounded-xl text-base-200 shadow-none border-none flex-1",
                  isBlocking ? "btn-primary" : "bg-base-100 text-secondary"
                )}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : `Yes, ${newStatus}`}
              </button>
              <button
                onClick={close}
                className="btn btn-secondary rounded-xl text-base-200 shadow-none border-none flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmBlockModal;
