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
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{titulo}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">{mensaje}</p>
            {nombreItem && (
              <p className="font-semibold text-gray-900 bg-gray-100 p-3 rounded-lg">
                {nombreItem}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


