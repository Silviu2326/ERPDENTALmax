import { useState } from 'react';
import { Calendar, CalendarDays, Clock } from 'lucide-react';
import { DatosReprogramacion } from '../api/citasApi';

interface SelectorDeAccionMasivaProps {
  datos: DatosReprogramacion;
  onDatosChange: (datos: DatosReprogramacion) => void;
}

export default function SelectorDeAccionMasiva({
  datos,
  onDatosChange,
}: SelectorDeAccionMasivaProps) {
  const [fechaFija, setFechaFija] = useState<string>('');

  const handleModoChange = (modo: 'mover_dias' | 'fecha_fija') => {
    if (modo === 'mover_dias') {
      onDatosChange({
        ...datos,
        modoReprogramacion: 'mover_dias',
        valor: 7, // Valor por defecto: 7 días
      });
    } else {
      const fechaDefault = new Date();
      fechaDefault.setDate(fechaDefault.getDate() + 7);
      const fechaISO = fechaDefault.toISOString().split('T')[0];
      setFechaFija(fechaISO);
      onDatosChange({
        ...datos,
        modoReprogramacion: 'fecha_fija',
        valor: fechaISO,
      });
    }
  };

  const handleValorChange = (valor: string) => {
    if (datos.modoReprogramacion === 'mover_dias') {
      const numDias = parseInt(valor, 10);
      if (!isNaN(numDias)) {
        onDatosChange({
          ...datos,
          valor: numDias,
        });
      }
    } else {
      setFechaFija(valor);
      onDatosChange({
        ...datos,
        valor: valor,
      });
    }
  };

  const handleNotificarChange = (notificar: boolean) => {
    onDatosChange({
      ...datos,
      notificarPacientes: notificar,
    });
  };

  const handleMotivoChange = (motivo: string) => {
    onDatosChange({
      ...datos,
      motivo: motivo,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Modo de Reprogramación
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleModoChange('mover_dias')}
            className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
              datos.modoReprogramacion === 'mover_dias'
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <CalendarDays size={24} className="text-blue-600" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Mover días</div>
              <div className="text-sm text-slate-600">Mover todas las citas X días hacia adelante</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleModoChange('fecha_fija')}
            className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
              datos.modoReprogramacion === 'fecha_fija'
                ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Calendar size={24} className="text-blue-600" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Fecha fija</div>
              <div className="text-sm text-slate-600">Mover todas a una fecha específica</div>
            </div>
          </button>
        </div>
      </div>

      <div>
        {datos.modoReprogramacion === 'mover_dias' ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Número de días a mover
            </label>
            <div className="relative">
              <input
                type="number"
                value={typeof datos.valor === 'number' ? datos.valor : 7}
                onChange={(e) => handleValorChange(e.target.value)}
                min="1"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 pr-16"
                placeholder="Ej: 7"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                días
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Las citas se moverán manteniendo la misma hora, pero en días posteriores
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nueva fecha
            </label>
            <input
              type="date"
              value={fechaFija || (typeof datos.valor === 'string' ? datos.valor.split('T')[0] : '')}
              onChange={(e) => handleValorChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
            <p className="mt-2 text-sm text-slate-600">
              Las citas se distribuirán en los espacios disponibles del profesional para esta fecha
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Motivo de la reprogramación *
        </label>
        <textarea
          value={datos.motivo}
          onChange={(e) => handleMotivoChange(e.target.value)}
          required
          rows={3}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          placeholder="Ej: Ausencia inesperada del profesional por enfermedad"
        />
        <p className="mt-2 text-sm text-slate-600">
          Este motivo quedará registrado en el historial de cambios de cada cita
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <input
          type="checkbox"
          id="notificar-pacientes"
          checked={datos.notificarPacientes}
          onChange={(e) => handleNotificarChange(e.target.checked)}
          className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="notificar-pacientes" className="flex-1 cursor-pointer">
          <div className="font-medium text-gray-900">Notificar a los pacientes</div>
          <div className="text-sm text-slate-600">
            Se enviarán notificaciones automáticas (SMS/Email/WhatsApp) a todos los pacientes afectados
          </div>
        </label>
      </div>
    </div>
  );
}



