import { useState } from 'react';
import { Edit, Plus, Calendar, FileText, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
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
        return <CheckCircle size={12} className="text-green-600" />;
      case 'En Progreso':
        return <Clock size={12} className="text-blue-600" />;
      case 'Planificado':
        return <XCircle size={12} className="text-gray-600" />;
      default:
        return <FileText size={12} className="text-gray-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Finalizado':
        return 'bg-green-100 text-green-800 ring-green-300';
      case 'En Progreso':
        return 'bg-blue-100 text-blue-800 ring-blue-300';
      case 'Planificado':
        return 'bg-gray-100 text-gray-800 ring-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 ring-gray-300';
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
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando historial de planes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Historial de Planes de Endodoncia</h2>
        <button
          onClick={onNuevoPlan}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus size={20} />
          <span>Nuevo Plan</span>
        </button>
      </div>

      {planes.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay planes registrados
          </h3>
          <p className="text-gray-600 mb-4">
            Comience creando un nuevo plan de endodoncia para este paciente
          </p>
          <button
            onClick={onNuevoPlan}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus size={20} />
            <span>Crear Primer Plan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {planes.map((plan) => (
            <div
              key={plan._id}
              className="bg-white ring-1 ring-slate-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Diente {plan.diente}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ring-1 flex items-center gap-1 ${getEstadoColor(
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
                      <p className="text-sm font-medium text-slate-700 mb-1">Conductometría:</p>
                      <div className="flex flex-wrap gap-2">
                        {plan.conductometria.map((conducto, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium ring-1 ring-blue-200"
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
                      <p className="text-sm font-medium text-slate-700 mb-1">Notas:</p>
                      <p className="text-sm text-gray-600">{plan.notas}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    {plan.fechaCreacion && (
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{formatearFecha(plan.fechaCreacion)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onEditarPlan(plan)}
                  className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  aria-label="Editar plan"
                >
                  <Edit size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



