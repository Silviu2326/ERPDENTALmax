import { useState } from 'react';
import { MoreVertical, CheckCircle, XCircle, Trash2, Eye, FileText, Edit, FileCheck } from 'lucide-react';
import { Presupuesto } from '../api/presupuestosApi';

interface MenuAccionesPresupuestoProps {
  presupuesto: Presupuesto;
  onVerDetalle: (presupuesto: Presupuesto) => void;
  onCambiarEstado: (id: string, nuevoEstado: 'Pendiente' | 'Aceptado' | 'Rechazado' | 'Completado' | 'Anulado') => void;
  onEliminar: (id: string) => void;
  onEditar?: (presupuestoId: string) => void;
  onAprobar?: (presupuestoId: string) => void;
}

export default function MenuAccionesPresupuesto({
  presupuesto,
  onVerDetalle,
  onCambiarEstado,
  onEliminar,
  onEditar,
  onAprobar,
}: MenuAccionesPresupuestoProps) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const handleCambiarEstado = (nuevoEstado: 'Pendiente' | 'Aceptado' | 'Rechazado' | 'Completado' | 'Anulado') => {
    onCambiarEstado(presupuesto._id!, nuevoEstado);
    setMostrarMenu(false);
  };

  const handleEliminar = () => {
    if (window.confirm('¿Está seguro de que desea eliminar este presupuesto?')) {
      onEliminar(presupuesto._id!);
      setMostrarMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarMenu(!mostrarMenu)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Acciones"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {mostrarMenu && (
        <>
          {/* Overlay para cerrar el menú al hacer clic fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMostrarMenu(false)}
          />
          {/* Menú de acciones */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={() => {
                  onVerDetalle(presupuesto);
                  setMostrarMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Detalle</span>
              </button>

              {/* Aprobar - Solo para estados Presentado o Pendiente */}
              {onAprobar && presupuesto._id && (presupuesto.estado === 'Pendiente' || presupuesto.estado === 'Presentado') && (
                <button
                  onClick={() => {
                    onAprobar(presupuesto._id!);
                    setMostrarMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center space-x-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Aprobar Presupuesto</span>
                </button>
              )}

              {/* Editar - Solo para estados Borrador o Presentado según el documento */}
              {onEditar && presupuesto._id && (presupuesto.estado === 'Pendiente' || presupuesto.estado === 'Rechazado') && (
                <button
                  onClick={() => {
                    onEditar(presupuesto._id!);
                    setMostrarMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
              )}

              {presupuesto.estado !== 'Aceptado' && (
                <button
                  onClick={() => handleCambiarEstado('Aceptado')}
                  className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Marcar como Aceptado</span>
                </button>
              )}

              {presupuesto.estado !== 'Rechazado' && presupuesto.estado !== 'Completado' && (
                <button
                  onClick={() => handleCambiarEstado('Rechazado')}
                  className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Marcar como Rechazado</span>
                </button>
              )}

              {presupuesto.estado === 'Aceptado' && presupuesto.estado !== 'Completado' && (
                <button
                  onClick={() => handleCambiarEstado('Completado')}
                  className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Marcar como Completado</span>
                </button>
              )}

              <div className="border-t border-gray-200 my-1" />

              <button
                onClick={handleEliminar}
                className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

