import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertCircle, Trash2, Info, CheckCircle, HelpCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success' | 'primary';
    isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Підтвердити',
    cancelText = 'Скасувати',
    variant = 'danger',
    isLoading = false
}) => {
    const icons = {
        danger: <Trash2 className="w-8 h-8 text-red-600" />,
        warning: <AlertCircle className="w-8 h-8 text-amber-600" />,
        primary: <HelpCircle className="w-8 h-8 text-blue-600" />,
        info: <Info className="w-8 h-8 text-blue-600" />,
        success: <CheckCircle className="w-8 h-8 text-emerald-600" />
    };

    const bgColors = {
        danger: 'bg-red-50',
        warning: 'bg-amber-50',
        primary: 'bg-blue-50',
        info: 'bg-blue-50',
        success: 'bg-emerald-100'
    };

    // Map variant to Button variant
    const buttonVariant: any = variant === 'primary' ? 'primary' :
        variant === 'danger' ? 'danger' :
            variant === 'success' ? 'success' : 'primary';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
            <div className="flex flex-col items-center text-center py-4">
                <div className={`w-20 h-20 ${bgColors[variant]} rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300`}>
                    {icons[variant]}
                </div>

                <div className="text-[15px] font-medium text-slate-600 mb-8 px-4 leading-relaxed">
                    {message}
                </div>

                <div className="flex flex-col w-full gap-3">
                    <Button
                        variant={buttonVariant}
                        onClick={onConfirm}
                        isLoading={isLoading}
                        className="w-full h-12 rounded-2xl text-base font-bold transition-all active:scale-[0.95]"
                    >
                        {confirmText}
                    </Button>
                    <button
                        onClick={onClose}
                        className="w-full h-12 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-colors active:scale-[0.98]"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
