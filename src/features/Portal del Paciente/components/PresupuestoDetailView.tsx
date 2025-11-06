import { useState, useEffect } from 'react';
import { Loader2, Calendar, User, Euro, FileText, Download } from 'lucide-react';
import { obtenerDetallePresupuesto, PresupuestoPaciente } from '../api/presupuestosApi';
import PresupuestoStatusBadge from './PresupuestoStatusBadge';
import TratamientoRow from './TratamientoRow';
import ApproveRejectActions from './ApproveRejectActions';

interface PresupuestoDetailViewProps {
  presupuestoId: string;
  onVolver: () => void;
  onPresupuestoActualizado?: (presupuesto: PresupuestoPaciente) => void;
}

export default function PresupuestoDetailView({
  presupuestoId,
  onVolver,
  onPresupuestoActualizado,
}: PresupuestoDetailViewProps) {
  const [presupuesto, setPresupuesto] = useState<PresupuestoPaciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDetalle();
  }, [presupuestoId]);

  const cargarDetalle = async () => {
    try {
      setCargando(true);
      setError(null);
      const datos = await obtenerDetallePresupuesto(presupuestoId);
      setPresupuesto(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el presupuesto');
      console.error('Error al cargar detalle:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleAprobado = (presupuestoActualizado: PresupuestoPaciente) => {
    setPresupuesto(presupuestoActualizado);
    if (onPresupuestoActualizado) {
      onPresupuestoActualizado(presupuestoActualizado);
    }
    alert('Presupuesto aprobado exitosamente');
  };

  const handleRechazado = (presupuestoActualizado: PresupuestoPaciente) => {
    setPresupuesto(presupuestoActualizado);
    if (onPresupuestoActualizado) {
      onPresupuestoActualizado(presupuestoActualizado);
    }
    alert('Presupuesto rechazado. La clínica será notificada.');
  };

  const handleDescargarPDF = () => {
    // TODO: Implementar descarga de PDF
    alert('Funcionalidad de descarga de PDF próximamente');
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Cargando presupuesto...</span>
      </div>
    );
  }

  if (error || !presupuesto) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 mb-4">{error || 'Presupuesto no encontrado'}</p>
        <button
          onClick={onVolver}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver
        </button>
      </div>
    );
  }

  const fechaCreacion = new Date(presupuesto.fechaCreacion);
  const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Información General */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Detalle del Presupuesto</h2>
            <div className="flex items-center space-x-3">
              <PresupuestoStatusBadge estado={presupuesto.estado} />
              <span className="text-sm text-gray-500">
                Creado el {fechaFormateada}
              </span>
            </div>
          </div>
          <button
            onClick={handleDescargarPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Odontólogo</p>
              <p className="font-medium text-gray-900">
                {presupuesto.dentista.nombre} {presupuesto.dentista.apellidos}
              </p>
            </div>
          </div>
          {presupuesto.fechaExpiracion && (
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Válido hasta</p>
                <p className="font-medium text-gray-900">
                  {new Date(presupuesto.fechaExpiracion).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          )}
        </div>

        {presupuesto.notasClinica && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Notas de la Clínica</p>
                <p className="text-sm text-blue-800 whitespace-pre-wrap">{presupuesto.notasClinica}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de Tratamientos */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Tratamientos Incluidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tratamiento
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Unit.
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {presupuesto.items.map((item, index) => (
                <TratamientoRow key={index} item={item} index={index} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen Financiero */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900 font-medium">{presupuesto.totalNeto.toFixed(2)} €</span>
              </div>
              {presupuesto.totalDescuento > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Descuento:</span>
                  <span className="text-red-600 font-medium">-{presupuesto.totalDescuento.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-blue-600 flex items-center">
                  <Euro className="w-5 h-5 mr-1" />
                  {presupuesto.totalFinal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notas del Paciente (si las hay) */}
      {presupuesto.notasPaciente && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 mb-1">Tus Notas</p>
              <p className="text-sm text-yellow-800 whitespace-pre-wrap">{presupuesto.notasPaciente}</p>
            </div>
          </div>
        </div>
      )}

      {/* Acciones de Aprobación/Rechazo */}
      <ApproveRejectActions
        presupuesto={presupuesto}
        onAprobado={handleAprobado}
        onRechazado={handleRechazado}
      />
    </div>
  );
}


