import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isDangerous = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1D1D1D] border border-[#333333] rounded-xs max-w-md w-full p-6 text-[#F2EFE9] space-y-4 shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#8C8C8C] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-rose-400">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <h3 className="font-editorial-serif font-bold text-lg text-[#F2EFE9]">
            {title}
          </h3>
        </div>

        <p className="text-xs text-[#8C8C8C] leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#333333]">
          <button
            onClick={onCancel}
            className="bg-[#111111] hover:bg-[#2A2A2A] text-[#F2EFE9] px-4 py-2 text-xs font-semibold rounded-xs border border-[#333333]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold rounded-xs ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-[#E6D19A] text-[#111111]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
