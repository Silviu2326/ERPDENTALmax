import { Calendar } from 'lucide-react';
import { FiltrosIndicadores } from '../api/indicadoresApi';

interface FiltrosIndicadoresPanelProps {
  filtros: FiltrosIndicadores;
  onFiltrosChange: (filtros: FiltrosIndicadores) => void;
  sedes?: Array<{ _id: string; nombre: string }>;
  profesionales?: Array<{ _id: string; nombre: string; apellidos: string }>;
}

export default function FiltrosIndicadoresPanel({
  filtros,
  onFiltrosChange,
  sedes = [],
  profesionales = [],
}: FiltrosIndicadoresPanelProps) {
  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      fechaInicio: new Date(e.target.value).toISOString(),
    });
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fechaFin = new Date(e.target.value);
    fechaFin.setHours(23, 59, 59, 999);
    onFiltrosChange({
      ...filtros,
      fechaFin: fechaFin.toISOString(),
    });
  };

  const handleSedeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      sedeId: e.target.value || undefined,
    });
  };

  const handleProfesionalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      profesionalId: e.target.value || undefined,
    });
  };

  const handleIntervaloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltrosChange({
      ...filtros,
      intervalo: e.target.value as 'diario' | 'semanal' | 'mensual',
    });
  };

  const aplicarRangoPredefinido = (rango: string) => {
    const hoy = new Date();
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    let fechaInicio = new Date();

    switch (rango) {
      case 'hoy':
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case 'ayer':
        fechaInicio.setDate(fechaInicio.getDate() - 1);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setDate(fechaFin.getDate() - 1);
        fechaFin.setHours(23, 59, 59, 999);
        break;
      case 'ultimos7':
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case 'ultimos30':
        fechaInicio.setDate(fechaInicio.getDate() - 30);
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case 'mesActual':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case 'mesAnterior':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        fechaFin.setHours(23, 59, 59, 999);
        break;
    }

    onFiltrosChange({
      ...filtros,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
    });
  };

  const fechaInicioFormateada = new Date(filtros.fechaInicio).toISOString().split('T')[0];
  const fechaFinFormateada = new Date(filtros.fechaFin).toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filtros de Indicadores</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rangos predefinidos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango Predefinido
          </label>
          <select
            onChange={(e) => aplicarRangoPredefinido(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Personalizado</option>
            <option value="hoy">Hoy</option>
            <option value="ayer">Ayer</option>
            <option value="ultimos7">Últimos 7 días</option>
            <option value="ultimos30">Últimos 30 días</option>
            <option value="mesActual">Mes actual</option>
            <option value="mesAnterior">Mes anterior</option>
          </select>
        </div>

        {/* Fecha inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={fechaInicioFormateada}
            onChange={handleFechaInicioChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Fecha fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Fin
          </label>
          <input
            type="date"
            value={fechaFinFormateada}
            onChange={handleFechaFinChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Intervalo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intervalo
          </label>
          <select
            value={filtros.intervalo || 'diario'}
            onChange={handleIntervaloChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
          </select>
        </div>
      </div>

      {/* Filtros adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Sede */}
        {sedes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sede (opcional)
            </label>
            <select
              value={filtros.sedeId || ''}
              onChange={handleSedeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las sedes</option>
              {sedes.map((sede) => (
                <option key={sede._id} value={sede._id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Profesional */}
        {profesionales.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profesional (opcional)
            </label>
            <select
              value={filtros.profesionalId || ''}
              onChange={handleProfesionalChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los profesionales</option>
              {profesionales.map((prof) => (
                <option key={prof._id} value={prof._id}>
                  {prof.nombre} {prof.apellidos}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}


