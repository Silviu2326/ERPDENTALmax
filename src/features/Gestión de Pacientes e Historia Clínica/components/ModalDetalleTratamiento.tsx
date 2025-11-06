import { useState, useEffect } from 'react';
import { X, Calendar, User, DollarSign, Tooth, FileText, Save, Loader2 } from 'lucide-react';
import {
  TratamientoRealizado,
  obtenerTratamientoRealizadoPorId,
  actualizarTratamientoRealizado,
} from '../api/tratamientosRealizadosApi';

interface ModalDetalleTratamientoProps {
  tratamientoId: string | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ModalDetalleTratamiento({
  tratamientoId,
  onClose,
  onUpdate,
}: ModalDetalleTratamientoProps) {
  const [tratamiento, setTratamiento] = useState<TratamientoRealizado | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notasClinicas, setNotasClinicas] = useState('');
  const [editandoNotas, setEditandoNotas] = useState(false);

  useEffect(() => {
    if (tratamientoId) {
      cargarDetalle();
    }
  }, [tratamientoId]);

  const cargarDetalle = async () => {
    if (!tratamientoId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTratamientoRealizadoPorId(tratamientoId);
      setTratamiento(data);
      setNotasClinicas(data.notasClinicas || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle del tratamiento');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarNotas = async () => {
    if (!tratamientoId || !editandoNotas) return;

    setSaving(true);
    setError(null);
    try {
      await actualizarTratamientoRealizado(tratamientoId, {
        notasClinicas,
      });
      setEditandoNotas(false);
      if (onUpdate) {
        onUpdate();
      }
      // Recargar los datos
      await cargarDetalle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar las notas');
    } finally {
      setSaving(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(monto);
  };

  const getEstadoPagoColor = (estado: string) => {
    switch (estado) {
      case 'Pagado':
        return 'bg-green-100 text-green-800';
      case 'Pagado Parcial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!tratamientoId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Detalle del Tratamiento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : tratamiento ? (
            <div className="space-y-6">
              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Fecha de Realización</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {formatearFecha(tratamiento.fechaRealizacion)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Profesional</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {tratamiento.odontologo.nombre} {tratamiento.odontologo.apellidos}
                  </p>
                </div>

                {tratamiento.piezaDental && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Tooth className="w-5 h-5" />
                      <span className="font-medium">Pieza Dental</span>
                    </div>
                    <p className="text-gray-900 font-semibold">
                      {tratamiento.piezaDental}
                      {tratamiento.superficie && ` (${tratamiento.superficie})`}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-medium">Costo</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">
                    {formatearMoneda(tratamiento.costo)}
                  </p>
                </div>
              </div>

              {/* Tratamiento */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Tratamiento Realizado</h3>
                <p className="text-gray-900 text-lg">{tratamiento.tratamientoBase.nombre}</p>
                {tratamiento.tratamientoBase.codigo && (
                  <p className="text-gray-600 text-sm mt-1">
                    Código: {tratamiento.tratamientoBase.codigo}
                  </p>
                )}
              </div>

              {/* Estado de Pago */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Estado de Pago:</span>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getEstadoPagoColor(
                      tratamiento.estadoPago
                    )}`}
                  >
                    {tratamiento.estadoPago}
                  </span>
                </div>
                {tratamiento.cobrosAsociados && tratamiento.cobrosAsociados.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Cobros Asociados:</p>
                    <ul className="space-y-1">
                      {tratamiento.cobrosAsociados.map((cobro, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {formatearMoneda(cobro.monto)} - {formatearFecha(cobro.fecha)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Notas Clínicas */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Notas Clínicas</h3>
                  </div>
                  {!editandoNotas && (
                    <button
                      onClick={() => setEditandoNotas(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                  )}
                </div>
                {editandoNotas ? (
                  <div className="space-y-3">
                    <textarea
                      value={notasClinicas}
                      onChange={(e) => setNotasClinicas(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ingrese las notas clínicas del tratamiento..."
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditandoNotas(false);
                          setNotasClinicas(tratamiento.notasClinicas || '');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={saving}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleGuardarNotas}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Guardar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {tratamiento.notasClinicas ? (
                      <p className="text-gray-700 whitespace-pre-wrap">{tratamiento.notasClinicas}</p>
                    ) : (
                      <p className="text-gray-400 italic">No hay notas clínicas registradas</p>
                    )}
                  </div>
                )}
              </div>

              {/* Información de Auditoría */}
              <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
                <p>
                  Creado por: {tratamiento.createdBy.nombre} {tratamiento.createdBy.apellidos} el{' '}
                  {formatearFecha(tratamiento.createdAt)}
                </p>
                {tratamiento.updatedAt !== tratamiento.createdAt && (
                  <p className="mt-1">
                    Última actualización: {formatearFecha(tratamiento.updatedAt)}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


