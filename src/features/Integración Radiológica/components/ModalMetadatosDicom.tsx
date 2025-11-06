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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Metadatos DICOM</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          <div className="space-y-2">
            {Object.entries(metadatos).map(([key, value]) => (
              <div key={key} className="flex border-b pb-2">
                <div className="w-1/3 font-medium text-gray-700">{key}:</div>
                <div className="w-2/3 text-gray-600">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


