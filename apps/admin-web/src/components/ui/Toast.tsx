import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import './toast.css';

interface ToastItem {
  id: number;
  type: 'success' | 'error';
  text: string;
}

interface Props {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}

function Toast({ toasts, onRemove }: Props) {
  return (
    <div className="toast-stack">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast-card toast-${toast.type}`}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="toast-icon">
              {toast.type === 'success' ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
            </div>

            <div className="toast-content">
              <strong>{toast.type === 'success' ? 'Correcto' : 'Atención'}</strong>
              <span>{toast.text}</span>
            </div>

            <button
              type="button"
              className="toast-close"
              onClick={() => onRemove(toast.id)}
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Toast;