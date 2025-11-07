import { useState } from 'react';
import { Calendar, Eye, Camera, Edit2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { SeguimientoRetencion } from '../api/retencionApi';
import ModalDetalleRetenedor from './ModalDetalleRetenedor';

interface TablaSeguimientoRetencionProps {
  seguimientos: SeguimientoRetencion[];
  onVerDetalle: (seguimiento: SeguimientoRetencion) => void;
  onEditar: (seguimiento: SeguimientoRetencion) => void;
  onAgregarFoto?: (seguimientoId: string) => void;
}

export default function TablaSeguimientoRetencion({
  seguimientos,
  onVerDetalle,
  onEditar,
  onAgregarFoto,
}: TablaSeguimientoRetencionProps) {
  const [seguimientoSeleccionado, setSeguimientoSeleccionado] = useState<SeguimientoRetencion | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const obtenerEstadoBadge = (estado: string) => {
    const estilos = {
      Programada: 'bg-blue-100 text-blue-800 border-blue-300',
      Realizada: 'bg-green-100 text-green-800 border-green-300',
      Cancelada: 'bg-red-100 text-red-800 border-red-300',
    };

    const iconos = {
      Programada: <Clock className="w-4 h-4" />,
      Realizada: <CheckCircle className="w-4 h-4" />,
      Cancelada: <XCircle className="w-4 h-4" />,
    };

    return {
      estilo: estilos[estado as keyof typeof estilos] || estilos.Programada,
      icono: iconos[estado as keyof typeof iconos] || iconos.Programada,
    };
  };

  const handleVerDetalle = (seguimiento: SeguimientoRetencion) => {
    setSeguimientoSeleccionado(seguimiento);
    setMostrarModal(true);
  };

  if (seguimientos.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay seguimientos registrados
        </h3>
        <p className="text-gray-600 mb-4">
          Los seguimientos de retención aparecerán aquí una vez que se agreguen
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Cita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fotos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seguimientos.map((seguimiento) => {
                const estadoBadge = obtenerEstadoBadge(seguimiento.estado);
                return (
                  <tr key={seguimiento._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatearFecha(seguimiento.fechaCita)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${estadoBadge.estilo}`}
                      >
                        {estadoBadge.icono}
                        {seguimiento.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {seguimiento.observaciones || 'Sin observaciones'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Camera size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {seguimiento.fotos?.length || 0} foto(s)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerDetalle(seguimiento)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye size={16} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditar(seguimiento)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={16} className="w-4 h-4" />
                        </button>
                        {onAgregarFoto && (
                          <button
                            onClick={() => onAgregarFoto(seguimiento._id || '')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Agregar foto"
                          >
                            <Camera size={16} className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarModal && seguimientoSeleccionado && (
        <ModalDetalleRetenedor
          seguimiento={seguimientoSeleccionado}
          onClose={() => {
            setMostrarModal(false);
            setSeguimientoSeleccionado(null);
          }}
          onEditar={() => {
            setMostrarModal(false);
            onEditar(seguimientoSeleccionado);
          }}
        />
      )}
    </>
  );
}



