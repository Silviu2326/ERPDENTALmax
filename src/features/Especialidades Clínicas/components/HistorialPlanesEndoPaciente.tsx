import { useState } from 'react';
import { Edit, Plus, Calendar, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { PlanEndodoncia } from '../api/planEndodonciaApi';

interface HistorialPlanesEndoPacienteProps {
  pacienteId: string;
  planes: PlanEndodoncia[];
  cargando: boolean;
  onEditarPlan: (plan: PlanEndodoncia) => void;
  onNuevoPlan: () => void;
}

export default function HistorialPlanesEndoPaciente({
  pacienteId,
  planes,
  cargando,
  onEditarPlan,
  onNuevoPlan,
}: HistorialPlanesEndoPacienteProps) {
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Finalizado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'En Progreso':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Planificado':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Finalizado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Planificado':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatearFecha = (fecha: string | Date) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando historial de planes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Historial de Planes de Endodoncia</h2>
        <button
          onClick={onNuevoPlan}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Plan</span>
        </button>
      </div>

      {planes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No hay planes registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Comience creando un nuevo plan de endodoncia para este paciente
          </p>
          <button
            onClick={onNuevoPlan}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Primer Plan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {planes.map((plan) => (
            <div
              key={plan._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Diente {plan.diente}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getEstadoColor(
                        plan.estado || 'Planificado'
                      )}`}
                    >
                      {getEstadoIcon(plan.estado || 'Planificado')}
                      {plan.estado || 'Planificado'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Diagnóstico Pulpar:</span>{' '}
                        {plan.diagnosticoPulpar || 'No especificado'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Diagnóstico Periapical:</span>{' '}
                        {plan.diagnosticoPeriapical || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Técnica Instrumentación:</span>{' '}
                        {plan.tecnicaInstrumentacion || 'No especificada'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Técnica Obturación:</span>{' '}
                        {plan.tecnicaObturacion || 'No especificada'}
                      </p>
                    </div>
                  </div>

                  {plan.conductometria && plan.conductometria.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Conductometría:</p>
                      <div className="flex flex-wrap gap-2">
                        {plan.conductometria.map((conducto, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                          >
                            {conducto.nombreCanal || `Conducto ${idx + 1}`}:{' '}
                            {conducto.longitudRealTrabajo || conducto.longitudTentativa || 0}mm
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.notas && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Notas:</p>
                      <p className="text-sm text-gray-600">{plan.notas}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    {plan.fechaCreacion && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatearFecha(plan.fechaCreacion)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onEditarPlan(plan)}
                  className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Editar plan"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


