import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // danger, warning, primary
  isLoading = false,
}) => {
  const icons = {
    danger: <AlertTriangle className="w-10 h-10 text-red-500 bg-red-50 p-2 rounded-full mb-3" />,
    warning: <AlertCircle className="w-10 h-10 text-amber-500 bg-amber-50 p-2 rounded-full mb-3" />,
    primary: <Info className="w-10 h-10 text-blue-500 bg-blue-50 p-2 rounded-full mb-3" />,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showClose={!isLoading}>
      <div className="flex flex-col items-center text-center pt-2 pb-4">
        {icons[variant] || icons.danger}
        <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-600 mb-6">{description}</p>

        <div className="flex items-center gap-3 w-full justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
            {cancelText}
          </Button>
          <Button
            variant={variant === 'warning' ? 'primary' : variant}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
