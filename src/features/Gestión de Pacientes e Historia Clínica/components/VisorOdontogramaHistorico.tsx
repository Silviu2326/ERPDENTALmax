import { X, Calendar } from 'lucide-react';

interface VisorOdontogramaHistoricoProps {
  odontogramaId: string;
  fecha: string;
  estadoPiezas?: any;
  onCerrar: () => void;
}

export default function VisorOdontogramaHistorico({
  odontogramaId,
  fecha,
  estadoPiezas,
  onCerrar,
}: VisorOdontogramaHistoricoProps) {
  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Odontograma Histórico</h3>
              <p className="text-sm text-gray-600">Snapshot del {formatearFecha(fecha)}</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Este es un snapshot del odontograma capturado en el momento de la visita.
              Muestra el estado de las piezas dentales en esa fecha específica.
            </p>
          </div>

          {/* Aquí iría el componente del odontograma */}
          {/* Por ahora, mostramos un placeholder */}
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">Odontograma Histórico</p>
            <p className="text-gray-400 text-sm">
              ID: {odontogramaId}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Fecha: {formatearFecha(fecha)}
            </p>
            {estadoPiezas && (
              <p className="text-gray-400 text-sm mt-2">
                Estado de piezas: {Object.keys(estadoPiezas).length} piezas registradas
              </p>
            )}
            <p className="text-gray-500 text-sm mt-4 italic">
              Nota: El componente visual del odontograma se integrará con el sistema de odontograma existente
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onCerrar}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



