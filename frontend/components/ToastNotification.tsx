"use client";

import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import placeholderPng from '@/assets/placeholder.png'

export const showToast = (
  message: string,
  type: "success" | "error" | "info",
  imgSrc?: string
) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg border border-gray-200`}
      >
        {imgSrc && (
          <Image
            src={placeholderPng}
            alt="Product"
            width={50}
            height={50}
            className="rounded-md"
          />
        )}
        <p className="text-sm font-medium">{message}</p>
      </div>
    ),
    { duration: 3000 }
  );
};

const ToastNotification = () => {
  return <Toaster position="top-right" reverseOrder={false} />;
};

export default ToastNotification;

