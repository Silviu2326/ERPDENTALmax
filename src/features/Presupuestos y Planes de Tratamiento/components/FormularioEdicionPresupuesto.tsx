import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Presupuesto, ItemPresupuesto } from '../api/presupuestosApi';

interface FormularioEdicionPresupuestoProps {
  presupuesto: Presupuesto;
  onCambio: (campo: keyof Presupuesto, valor: any) => void;
}

export default function FormularioEdicionPresupuesto({
  presupuesto,
  onCambio,
}: FormularioEdicionPresupuestoProps) {
  const [fechaVencimiento, setFechaVencimiento] = useState(
    presupuesto.fechaValidez || ''
  );
  const [notas, setNotas] = useState(presupuesto.notas || '');
  const [estado, setEstado] = useState(presupuesto.estado);

  useEffect(() => {
    if (presupuesto.fechaValidez) {
      setFechaVencimiento(presupuesto.fechaValidez);
    }
    if (presupuesto.notas) {
      setNotas(presupuesto.notas);
    }
    setEstado(presupuesto.estado);
  }, [presupuesto]);

  const handleFechaVencimientoChange = (valor: string) => {
    setFechaVencimiento(valor);
    onCambio('fechaValidez', valor);
  };

  const handleNotasChange = (valor: string) => {
    setNotas(valor);
    onCambio('notas', valor);
  };

  const handleEstadoChange = (valor: string) => {
    setEstado(valor as Presupuesto['estado']);
    onCambio('estado', valor);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos Generales del Presupuesto</h2>

      {/* Información del paciente (solo lectura) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paciente
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
            {presupuesto.paciente.nombre} {presupuesto.paciente.apellidos}
            {presupuesto.paciente.dni && ` - DNI: ${presupuesto.paciente.dni}`}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profesional
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
            {presupuesto.profesional.nombre} {presupuesto.profesional.apellidos}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Presupuesto
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
            {presupuesto.numeroPresupuesto}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Creación
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
            {new Date(presupuesto.fechaCreacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Campos editables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Fecha de Vencimiento
          </label>
          <input
            type="date"
            value={fechaVencimiento}
            onChange={(e) => handleFechaVencimientoChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => handleEstadoChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Aceptado">Aceptado</option>
            <option value="Rechazado">Rechazado</option>
            <option value="Completado">Completado</option>
            <option value="Anulado">Anulado</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas Clínicas
        </label>
        <textarea
          value={notas}
          onChange={(e) => handleNotasChange(e.target.value)}
          rows={4}
          placeholder="Notas adicionales sobre el presupuesto..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}



