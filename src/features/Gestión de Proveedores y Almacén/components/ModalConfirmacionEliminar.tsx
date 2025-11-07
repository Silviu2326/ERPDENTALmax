import { X } from 'lucide-react';

interface ModalConfirmacionEliminarProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: () => void;
  titulo: string;
  mensaje: string;
  nombreItem?: string;
}

export default function ModalConfirmacionEliminar({
  isOpen,
  onClose,
  onConfirmar,
  titulo,
  mensaje,
  nombreItem,
}: ModalConfirmacionEliminarProps) {
  if (!isOpen) return null;

  const handleConfirmar = () => {
    onConfirmar();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 ring-1 ring-slate-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{titulo}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">{mensaje}</p>
            {nombreItem && (
              <p className="font-semibold text-gray-900 bg-slate-50 p-3 rounded-xl ring-1 ring-slate-200">
                {nombreItem}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



