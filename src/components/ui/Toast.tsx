'use client';

interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const typeStyles: Record<string, string> = {
  success: 'bg-violet-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-zinc-700 text-white',
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => onDismiss(toast.id)}
          className={`
            px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl cursor-pointer
            animate-in fade-in slide-in-from-bottom-2 duration-200
            ${typeStyles[toast.type ?? 'success']}
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
