import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PatientPreview, obtenerPacientesElegibles } from '../api/recallsApi';

interface PatientPreviewModalProps {
  circuitId: string;
  onCerrar: () => void;
}

export default function PatientPreviewModal({ circuitId, onCerrar }: PatientPreviewModalProps) {
  const [pacientes, setPacientes] = useState<PatientPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    cargarPacientes();
  }, [circuitId, page]);

  const cargarPacientes = async () => {
    try {
      setLoading(true);
      const response = await obtenerPacientesElegibles(circuitId, page, limit);
      setPacientes(response.patients);
      setTotal(response.total);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      alert('Error al cargar los pacientes elegibles');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Pacientes Elegibles ({total})
          </h2>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : pacientes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay pacientes elegibles para este circuito</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pacientes.map((paciente) => (
                <div
                  key={paciente._id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {paciente.nombre} {paciente.apellidos}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-600">
                        {paciente.email && (
                          <span>📧 {paciente.email}</span>
                        )}
                        {paciente.telefono && (
                          <span>📱 {paciente.telefono}</span>
                        )}
                        {paciente.ultimaCita && (
                          <span>📅 Última cita: {new Date(paciente.ultimaCita).toLocaleDateString()}</span>
                        )}
                        {paciente.ultimoTratamiento && (
                          <span>🦷 {paciente.ultimoTratamiento}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {(page - 1) * limit + 1} - {Math.min(page * limit, total)} de {total}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onCerrar}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



