import { useState, useEffect } from 'react';
import { Calendar, Wrench, FileText, DollarSign, User, Download, Plus, AlertCircle } from 'lucide-react';
import { MantenimientoAutoclave, obtenerMantenimientosAutoclave } from '../api/mantenimientoAutoclaveApi';
import FormularioRegistroMantenimiento from './FormularioRegistroMantenimiento';

interface HistorialMantenimientoProps {
  autoclaveId: string;
  onMantenimientoRegistrado?: () => void;
}

export default function HistorialMantenimiento({
  autoclaveId,
  onMantenimientoRegistrado,
}: HistorialMantenimientoProps) {
  const [mantenimientos, setMantenimientos] = useState<MantenimientoAutoclave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    cargarMantenimientos();
  }, [autoclaveId]);

  const cargarMantenimientos = async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerMantenimientosAutoclave(autoclaveId);
      // Ordenar por fecha descendente (más recientes primero)
      const ordenados = datos.sort((a, b) => {
        const fechaA = typeof a.fecha === 'string' ? new Date(a.fecha) : a.fecha;
        const fechaB = typeof b.fecha === 'string' ? new Date(b.fecha) : b.fecha;
        return fechaB.getTime() - fechaA.getTime();
      });
      setMantenimientos(ordenados);
    } catch (err: any) {
      console.error('Error al cargar mantenimientos:', err);
      setError(err.message || 'Error al cargar el historial de mantenimientos');
    } finally {
      setLoading(false);
    }
  };

  const handleMantenimientoRegistrado = async () => {
    setMostrarFormulario(false);
    await cargarMantenimientos();
    if (onMantenimientoRegistrado) {
      onMantenimientoRegistrado();
    }
  };

  const formatearFecha = (fecha: Date | string) => {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearCosto = (costo: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(costo);
  };

  if (mostrarFormulario) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FormularioRegistroMantenimiento
          autoclaveId={autoclaveId}
          onGuardar={handleMantenimientoRegistrado}
          onCancelar={() => setMostrarFormulario(false)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-sm text-red-800 mb-4">{error}</p>
              <button
                onClick={cargarMantenimientos}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Mantenimientos</h3>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          <span>Registrar Mantenimiento</span>
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {mantenimientos.length === 0 ? (
          <div className="p-12 text-center">
            <Wrench className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay registros de mantenimiento</h3>
            <p className="text-gray-600 mb-4">Aún no se han registrado mantenimientos para este autoclave</p>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Registrar el primer mantenimiento
            </button>
          </div>
        ) : (
          mantenimientos.map((mantenimiento) => (
            <div key={mantenimiento._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        mantenimiento.tipoMantenimiento === 'preventivo'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {mantenimiento.tipoMantenimiento === 'preventivo'
                        ? 'Preventivo'
                        : 'Correctivo'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatearFecha(mantenimiento.fecha)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-900 mb-3">{mantenimiento.descripcion}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">Técnico:</span>
                      <span className="ml-2">{mantenimiento.tecnicoResponsable}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="font-medium">Costo:</span>
                      <span className="ml-2">{formatearCosto(mantenimiento.costo)}</span>
                    </div>
                  </div>

                  {mantenimiento.documentosAdjuntos &&
                    mantenimiento.documentosAdjuntos.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-slate-500 mb-2">Documentos adjuntos:</p>
                        <div className="flex flex-wrap gap-2">
                          {mantenimiento.documentosAdjuntos.map((doc, index) => (
                            <a
                              key={index}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs ring-1 ring-slate-200"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              {doc.nombre}
                              <Download className="w-3 h-3 ml-1" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



