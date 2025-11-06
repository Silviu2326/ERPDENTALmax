import { useState, useEffect } from 'react';
import { FileText, Trash2, Eye, Download, Calendar, User, Pill } from 'lucide-react';
import { obtenerRecetasPorPaciente, anularReceta, Receta } from '../api/recetasApi';
import ModalVistaPreviaPDF from './ModalVistaPreviaPDF';

interface ListaHistorialRecetasProps {
  pacienteId: string;
  onRecetaCreada?: () => void;
}

export default function ListaHistorialRecetas({
  pacienteId,
  onRecetaCreada,
}: ListaHistorialRecetasProps) {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (pacienteId) {
      cargarRecetas();
    }
  }, [pacienteId]);

  useEffect(() => {
    if (onRecetaCreada) {
      // Si hay un callback de receta creada, recargar la lista
      cargarRecetas();
    }
  }, [onRecetaCreada]);

  const cargarRecetas = async () => {
    if (!pacienteId) return;

    setLoading(true);
    setError(null);
    try {
      const recetasData = await obtenerRecetasPorPaciente(pacienteId);
      // Ordenar por fecha más reciente primero
      recetasData.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      setRecetas(recetasData);
    } catch (err) {
      console.error('Error al cargar recetas:', err);
      setError('Error al cargar el historial de recetas');
    } finally {
      setLoading(false);
    }
  };

  const handleVerReceta = (receta: Receta) => {
    setRecetaSeleccionada(receta);
    setMostrarModal(true);
  };

  const handleAnularReceta = async (recetaId: string) => {
    if (!confirm('¿Estás seguro de que deseas anular esta receta?')) {
      return;
    }

    try {
      await anularReceta(recetaId);
      // Recargar la lista
      await cargarRecetas();
      alert('Receta anulada correctamente');
    } catch (err) {
      console.error('Error al anular receta:', err);
      alert('Error al anular la receta');
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && recetas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando historial de recetas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={cargarRecetas}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (recetas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No hay recetas registradas para este paciente</p>
          <p className="text-gray-500 text-sm mt-2">Las recetas que se creen aparecerán aquí</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Historial de Recetas</h3>
          <button
            onClick={cargarRecetas}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <Calendar className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
        </div>

        <div className="space-y-4">
          {recetas.map((receta) => (
            <div
              key={receta._id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                receta.estado === 'Anulada'
                  ? 'bg-gray-50 border-gray-300 opacity-75'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Receta #{receta.folio}
                      </h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500 flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatearFecha(receta.fecha)}</span>
                        </span>
                        <span className="text-sm text-gray-500 flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>
                            {receta.odontologo.nombre} {receta.odontologo.apellidos}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Pill className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Medicamentos ({receta.medicamentos.length})
                      </span>
                    </div>
                    <div className="pl-6 space-y-1">
                      {receta.medicamentos.slice(0, 3).map((med, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          • {med.nombre} - {med.dosis} cada {med.frecuencia}
                        </p>
                      ))}
                      {receta.medicamentos.length > 3 && (
                        <p className="text-sm text-gray-500 italic">
                          y {receta.medicamentos.length - 3} más...
                        </p>
                      )}
                    </div>
                  </div>

                  {receta.indicaciones_generales && (
                    <div className="mt-3 pl-6">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Indicaciones: </span>
                        {receta.indicaciones_generales}
                      </p>
                    </div>
                  )}

                  {receta.estado === 'Anulada' && (
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                        Anulada
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {receta.estado === 'Activa' && (
                    <>
                      <button
                        onClick={() => handleVerReceta(receta)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver receta"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAnularReceta(receta._id!)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Anular receta"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {receta.estado === 'Anulada' && (
                    <button
                      onClick={() => handleVerReceta(receta)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Ver receta anulada"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarModal && recetaSeleccionada && (
        <ModalVistaPreviaPDF
          receta={recetaSeleccionada}
          onCerrar={() => {
            setMostrarModal(false);
            setRecetaSeleccionada(null);
          }}
        />
      )}
    </>
  );
}


