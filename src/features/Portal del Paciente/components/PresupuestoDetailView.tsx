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
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando presupuesto...</p>
      </div>
    );
  }

  if (error || !presupuesto) {
    return (
      <div className="bg-white shadow-sm rounded-xl p-8 text-center">
        <p className="text-red-600 mb-4 text-lg font-semibold">{error || 'Presupuesto no encontrado'}</p>
        <button
          onClick={onVolver}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
      <div className="bg-white shadow-sm rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Información del Presupuesto</h2>
            <div className="flex items-center space-x-3">
              <PresupuestoStatusBadge estado={presupuesto.estado} />
              <span className="text-sm text-gray-600">
                Creado el {fechaFormateada}
              </span>
            </div>
          </div>
          <button
            onClick={handleDescargarPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium"
          >
            <Download size={20} />
            <span>Descargar PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Odontólogo</p>
              <p className="font-medium text-gray-900">
                {presupuesto.dentista.nombre} {presupuesto.dentista.apellidos}
              </p>
            </div>
          </div>
          {presupuesto.fechaExpiracion && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Válido hasta</p>
                <p className="font-medium text-gray-900">
                  {new Date(presupuesto.fechaExpiracion).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          )}
        </div>

        {presupuesto.notasClinica && (
          <div className="bg-blue-50 ring-1 ring-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <FileText size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Notas de la Clínica</p>
                <p className="text-sm text-blue-800 whitespace-pre-wrap">{presupuesto.notasClinica}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de Tratamientos */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tratamientos Incluidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Tratamiento
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Precio Unit.
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
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
        <div className="px-6 py-4 bg-slate-50 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="text-gray-900 font-medium">{presupuesto.totalNeto.toFixed(2)} €</span>
              </div>
              {presupuesto.totalDescuento > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Descuento:</span>
                  <span className="text-red-600 font-medium">-{presupuesto.totalDescuento.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2 mt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-blue-600 flex items-center">
                  <Euro size={20} className="mr-1" />
                  {presupuesto.totalFinal.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notas del Paciente (si las hay) */}
      {presupuesto.notasPaciente && (
        <div className="bg-yellow-50 ring-1 ring-yellow-200 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <FileText size={20} className="text-yellow-600 mt-0.5" />
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



