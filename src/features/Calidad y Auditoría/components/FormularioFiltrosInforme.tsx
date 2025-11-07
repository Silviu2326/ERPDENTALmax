import { useState, useEffect } from 'react';
import { Calendar, MapPin, Filter } from 'lucide-react';
import { FiltrosInforme } from '../api/informesAcreditacionApi';

interface FormularioFiltrosInformeProps {
  filtros: FiltrosInforme;
  onFiltrosChange: (filtros: FiltrosInforme) => void;
  filtrosDisponibles?: string[];
  error?: string;
}

interface Clinica {
  _id: string;
  nombre: string;
}

export default function FormularioFiltrosInforme({
  filtros,
  onFiltrosChange,
  filtrosDisponibles = [],
  error,
}: FormularioFiltrosInformeProps) {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loadingClinicas, setLoadingClinicas] = useState(false);

  // Cargar clínicas disponibles (simulado, debería venir de una API)
  useEffect(() => {
    const cargarClinicas = async () => {
      try {
        setLoadingClinicas(true);
        // TODO: Implementar llamada real a la API
        // const response = await fetch('/api/clinicas');
        // const data = await response.json();
        // setClinicas(data);
        
        // Simulación temporal
        await new Promise(resolve => setTimeout(resolve, 300));
        setClinicas([
          { _id: '1', nombre: 'Clínica Principal' },
          { _id: '2', nombre: 'Clínica Sede 2' },
        ]);
      } catch (err) {
        console.error('Error al cargar clínicas:', err);
      } finally {
        setLoadingClinicas(false);
      }
    };

    if (filtrosDisponibles.includes('clinica')) {
      cargarClinicas();
    }
  }, [filtrosDisponibles]);

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = new Date(e.target.value);
    nuevaFecha.setHours(0, 0, 0, 0);
    onFiltrosChange({
      ...filtros,
      fechaInicio: nuevaFecha,
    });
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = new Date(e.target.value);
    nuevaFecha.setHours(23, 59, 59, 999);
    onFiltrosChange({
      ...filtros,
      fechaFin: nuevaFecha,
    });
  };

  const handleClinicaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      clinicaId: e.target.value || undefined,
    });
  };

  const tieneFiltro = (filtro: string) => {
    return filtrosDisponibles.includes(filtro);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-slate-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filtros del Informe</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro de Fecha Inicio */}
          {tieneFiltro('fecha') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtros.fechaInicio.toISOString().split('T')[0]}
                onChange={handleFechaInicioChange}
                max={filtros.fechaFin.toISOString().split('T')[0]}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
              />
            </div>
          )}

          {/* Filtro de Fecha Fin */}
          {tieneFiltro('fecha') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtros.fechaFin.toISOString().split('T')[0]}
                onChange={handleFechaFinChange}
                min={filtros.fechaInicio.toISOString().split('T')[0]}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5"
              />
            </div>
          )}

          {/* Filtro de Clínica */}
          {tieneFiltro('clinica') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                Clínica (Opcional)
              </label>
              <select
                value={filtros.clinicaId || ''}
                onChange={handleClinicaChange}
                disabled={loadingClinicas}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-3 pr-3 py-2.5 disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">Todas las clínicas</option>
                {clinicas.map((clinica) => (
                  <option key={clinica._id} value={clinica._id}>
                    {clinica.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Los informes se generan de forma asíncrona. Una vez iniciado el proceso,
          podrás consultar el estado en el historial de informes.
        </p>
      </div>
    </div>
  );
}



