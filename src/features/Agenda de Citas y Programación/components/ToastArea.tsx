import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';

export interface Toast {
  id: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
  titulo: string;
  mensaje: string;
  duracion?: number; // en milisegundos, por defecto 5000
  accion?: {
    etiqueta: string;
    onClick: () => void;
  };
  citaId?: string; // Para destacar la cita relacionada
}

interface ToastAreaProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  onToastClick?: (toast: Toast) => void;
}

export default function ToastArea({ toasts, onRemove, onToastClick }: ToastAreaProps) {
  const [visibleToasts, setVisibleToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setVisibleToasts(toasts);
  }, [toasts]);

  useEffect(() => {
    // Auto-remover toasts después de su duración
    const timeouts: NodeJS.Timeout[] = [];
    
    visibleToasts.forEach((toast) => {
      const duracion = toast.duracion || 5000;
      const timeout = setTimeout(() => {
        onRemove(toast.id);
      }, duracion);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [visibleToasts, onRemove]);

  const getIcon = (tipo: Toast['tipo']) => {
    switch (tipo) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStyles = (tipo: Toast['tipo']) => {
    switch (tipo) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      {visibleToasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => {
            if (onToastClick) {
              onToastClick(toast);
            }
          }}
          className={`
            ${getStyles(toast.tipo)}
            border rounded-lg shadow-lg p-4
            transform transition-all duration-300 ease-in-out
            hover:shadow-xl cursor-pointer
            ${onToastClick ? 'hover:scale-[1.02]' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.tipo)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{toast.titulo}</h4>
              <p className="text-sm opacity-90">{toast.mensaje}</p>
              {toast.accion && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.accion?.onClick();
                  }}
                  className="mt-2 text-sm font-medium underline hover:no-underline"
                >
                  {toast.accion.etiqueta}
                </button>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(toast.id);
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

