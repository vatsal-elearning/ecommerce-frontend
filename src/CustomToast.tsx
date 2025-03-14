import { Toast } from 'flowbite-react';
import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { useEffect } from 'react';
import { ToastType } from './constants';

interface CustomToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
  type,
  message,
  onClose,
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null; // Hide if no message

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
      {type === ToastType.SUCCESS ? (
        <Toast className="bg-green-500 text-white shadow-lg flex items-center p-3 rounded-lg">
          <XMarkIcon className="h-6 w-6 text-white mr-2" />
          <div className="text-sm font-medium">{message}</div>
          <button onClick={onClose} className="ml-2 text-white font-bold">
            ✖
          </button>
        </Toast>
      ) : (
        <Toast className="bg-red-500 text-white shadow-lg flex items-center p-3 rounded-lg">
          <XCircleIcon className="h-6 w-6 text-white mr-2" />
          <div className="text-sm font-medium">{message}</div>
          <button onClick={onClose} className="ml-2 text-white font-bold">
            ✖
          </button>
        </Toast>
      )}
    </div>
  );
};

export default CustomToast;
