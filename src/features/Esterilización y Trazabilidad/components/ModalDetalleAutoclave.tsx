import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Wrench, CheckCircle, XCircle, AlertCircle, Edit } from 'lucide-react';
import {
  Autoclave,
  obtenerAutoclavePorId,
  obtenerMantenimientosAutoclave,
  MantenimientoAutoclave,
} from '../api/mantenimientoAutoclaveApi';
import HistorialMantenimiento from './HistorialMantenimiento';
import FormularioRegistroMantenimiento from './FormularioRegistroMantenimiento';

interface ModalDetalleAutoclaveProps {
  autoclaveId: string | null;
  onCerrar: () => void;
  onEditar?: (autoclave: Autoclave) => void;
  onMantenimientoRegistrado?: () => void;
}

export default function ModalDetalleAutoclave({
  autoclaveId,
  onCerrar,
  onEditar,
  onMantenimientoRegistrado,
}: ModalDetalleAutoclaveProps) {
  const [autoclave, setAutoclave] = useState<Autoclave | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormularioMantenimiento, setMostrarFormularioMantenimiento] = useState(false);

  useEffect(() => {
    if (autoclaveId) {
      cargarDetalles();
    }
  }, [autoclaveId]);

  const cargarDetalles = async () => {
    if (!autoclaveId) return;

    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerAutoclavePorId(autoclaveId);
      setAutoclave(datos);
    } catch (err: any) {
      console.error('Error al cargar detalles:', err);
      setError(err.message || 'Error al cargar los detalles del autoclave');
    } finally {
      setLoading(false);
    }
  };

  const handleMantenimientoRegistrado = async () => {
    setMostrarFormularioMantenimiento(false);
    await cargarDetalles();
    if (onMantenimientoRegistrado) {
      onMantenimientoRegistrado();
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Activo
          </span>
        );
      case 'en_reparacion':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Wrench className="w-4 h-4 mr-1" />
            En Reparación
          </span>
        );
      case 'inactivo':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Inactivo
          </span>
        );
      default:
        return null;
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

  const getDiasProximoMantenimiento = (fecha: Date | string) => {
    const fechaMantenimiento = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaMantenimiento.setHours(0, 0, 0, 0);
    const diffTime = fechaMantenimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!autoclaveId) {
    return null;
  }

  if (mostrarFormularioMantenimiento && autoclave) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <FormularioRegistroMantenimiento
              autoclaveId={autoclaveId}
              onGuardar={handleMantenimientoRegistrado}
              onCancelar={() => setMostrarFormularioMantenimiento(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">Detalle del Autoclave</h2>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando detalles...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
                  <p className="text-sm text-red-800 mb-4">{error}</p>
                  <button
                    onClick={cargarDetalles}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            </div>
          ) : autoclave ? (
            <div className="space-y-6">
              {/* Información General */}
              <div className="bg-white rounded-lg ring-1 ring-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{autoclave.nombre}</h3>
                    <p className="text-sm text-gray-600">
                      {autoclave.marca} {autoclave.modelo}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getEstadoBadge(autoclave.estado)}
                    {onEditar && (
                      <button
                        onClick={() => onEditar(autoclave)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar autoclave"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Fecha de Instalación</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatearFecha(autoclave.fechaInstalacion)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Ubicación</p>
                      <p className="text-sm font-medium text-gray-900">{autoclave.ubicacion}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
                      <Wrench className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Próximo Mantenimiento</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatearFecha(autoclave.proximoMantenimiento)}
                      </p>
                      {getDiasProximoMantenimiento(autoclave.proximoMantenimiento) < 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          Vencido hace {Math.abs(getDiasProximoMantenimiento(autoclave.proximoMantenimiento))} días
                        </p>
                      )}
                      {getDiasProximoMantenimiento(autoclave.proximoMantenimiento) >= 0 &&
                        getDiasProximoMantenimiento(autoclave.proximoMantenimiento) <= 7 && (
                          <p className="text-xs text-yellow-600 mt-1">
                            En {getDiasProximoMantenimiento(autoclave.proximoMantenimiento)} días
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-100 rounded-xl ring-1 ring-slate-200/70">
                      <span className="text-xs font-medium text-slate-600">#</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Número de Serie</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">
                        {autoclave.numeroSerie}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historial de Mantenimientos */}
              <div>
                <HistorialMantenimiento
                  autoclaveId={autoclaveId}
                  onMantenimientoRegistrado={handleMantenimientoRegistrado}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}



