import { X } from 'lucide-react';

interface ModalMetadatosDicomProps {
  metadatos: {
    [key: string]: any;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalMetadatosDicom({ metadatos, isOpen, onClose }: ModalMetadatosDicomProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white shadow-xl rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col m-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Metadatos DICOM</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            aria-label="Cerrar"
          >
            <X size={20} className="text-slate-700" />
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          <div className="space-y-3">
            {Object.entries(metadatos).map(([key, value]) => (
              <div key={key} className="flex border-b border-gray-200 pb-3 last:border-0">
                <div className="w-1/3 font-medium text-slate-700 text-sm">{key}:</div>
                <div className="w-2/3 text-slate-600 text-sm break-words">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



