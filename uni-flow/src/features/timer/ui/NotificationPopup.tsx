import React from "react";

type NotificationPopupProps = {
  message: string;
  onClose: () => void;
};

const NotificationPopup = ({ message, onClose }: NotificationPopupProps) => {
  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded shadow-lg z-50">
      <div className="flex items-center justify-between">
        <span className="text-body1">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;