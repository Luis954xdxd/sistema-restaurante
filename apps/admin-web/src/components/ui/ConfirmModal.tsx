import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, EyeOff, X } from 'lucide-react';
import './confirm-modal.css';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  secondaryText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onSecondaryAction?: () => void;
}

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  secondaryText,
  isDanger = false,
  isLoading = false,
  onConfirm,
  onCancel,
  onSecondaryAction,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="confirm-modal-overlay" onClick={onCancel}>
          <motion.div
            className="confirm-modal-card"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="confirm-modal-close"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X size={18} />
            </button>

            <div className="confirm-modal-icon">
              <AlertTriangle size={24} />
            </div>

            <h3>{title}</h3>
            <p>{message}</p>

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="button-secondary"
                onClick={onCancel}
                disabled={isLoading}
              >
                {cancelText}
              </button>

              {secondaryText && onSecondaryAction && (
                <button
                  type="button"
                  className="button-warning"
                  onClick={onSecondaryAction}
                  disabled={isLoading}
                >
                  <EyeOff size={16} />
                  <span>{secondaryText}</span>
                </button>
              )}

              <button
                type="button"
                className={isDanger ? 'button-danger' : 'button-primary'}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;