import React from "react";

type NotificationPopupProps = {
  message: string;
  onClose: () => void;
};

const NotificationPopup = ({ message, onClose }: NotificationPopupProps) => {
  return (
    <div className="fixed bottom-4 right-4 bg-primary-light text-white p-4 rounded-full shadow-lg z-50">
      <div className="flex items-center justify-between">
        <span className="text-body1">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 bg-white border border-primary-light text-primary px-4 py-2 rounded-full font-bold shadow"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;