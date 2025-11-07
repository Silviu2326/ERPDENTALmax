import { useState } from 'react';
import { Package, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { DetallesProtesis, confirmarEntregaProtesis } from '../api/protesisRemovibleApi';
import ModalConfirmacionEntrega from './ModalConfirmacionEntrega';

interface PanelControlEntregaProps {
  detallesProtesis: DetallesProtesis;
  onEntregaConfirmada: () => void;
}

export default function PanelControlEntrega({
  detallesProtesis,
  onEntregaConfirmada,
}: PanelControlEntregaProps) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Entregado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'En Prueba':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Ajustes':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'En Laboratorio':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEstadoIcono = (estado: string) => {
    switch (estado) {
      case 'Entregado':
        return <CheckCircle className="w-5 h-5" />;
      case 'En Prueba':
      case 'Ajustes':
        return <Clock className="w-5 h-5" />;
      case 'En Laboratorio':
        return <Package className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const handleConfirmarEntrega = async (fechaEntrega: string, notasFinales?: string) => {
    setGuardando(true);
    try {
      await confirmarEntregaProtesis({
        tratamientoId: detallesProtesis.tratamientoId,
        fechaEntregaReal: fechaEntrega,
        notasFinales,
      });
      setMostrarModal(false);
      onEntregaConfirmada();
    } catch (error) {
      console.error('Error al confirmar entrega:', error);
      alert('Error al confirmar la entrega. Por favor, intente nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  const yaEntregado = detallesProtesis.estadoProtesis === 'Entregado';

  return (
    <>
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Control de Entrega</h3>

        {/* Estado actual */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Estado Actual</label>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ring-1 ${getEstadoColor(
              detallesProtesis.estadoProtesis
            )}`}
          >
            {getEstadoIcono(detallesProtesis.estadoProtesis)}
            <span className="font-semibold">{detallesProtesis.estadoProtesis}</span>
          </div>
        </div>

        {/* Información de entrega */}
        {yaEntregado && detallesProtesis.fechaEntregaReal && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <CheckCircle size={20} />
              <span className="font-semibold">Prótesis Entregada</span>
            </div>
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <Calendar size={16} />
              <span>
                Fecha de entrega: {new Date(detallesProtesis.fechaEntregaReal).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {detallesProtesis.notasEntrega && (
              <div className="mt-2 text-sm text-green-700">
                <p className="font-medium mb-1">Notas de entrega:</p>
                <p className="whitespace-pre-wrap">{detallesProtesis.notasEntrega}</p>
              </div>
            )}
          </div>
        )}

        {/* Botón de confirmar entrega */}
        {!yaEntregado && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Cuando la prótesis haya sido aceptada por el paciente y esté lista para la entrega final,
              confirme la entrega para actualizar el estado del tratamiento.
            </p>
            <button
              onClick={() => setMostrarModal(true)}
              disabled={guardando}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <CheckCircle size={20} />
              Confirmar Entrega de Prótesis
            </button>
          </div>
        )}

        {/* Información adicional */}
        {detallesProtesis.ordenLaboratorioId && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-slate-600">
              <span className="font-medium">ID Orden Laboratorio:</span> {detallesProtesis.ordenLaboratorioId}
            </p>
          </div>
        )}
      </div>

      {mostrarModal && (
        <ModalConfirmacionEntrega
          tratamientoId={detallesProtesis.tratamientoId}
          pacienteNombre={
            detallesProtesis.paciente
              ? `${detallesProtesis.paciente.nombre} ${detallesProtesis.paciente.apellidos}`
              : 'Paciente'
          }
          onConfirmar={handleConfirmarEntrega}
          onCancelar={() => setMostrarModal(false)}
        />
      )}
    </>
  );
}



