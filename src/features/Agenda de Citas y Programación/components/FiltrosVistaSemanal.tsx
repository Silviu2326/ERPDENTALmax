import { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface Profesional {
  _id: string;
  nombre: string;
  apellidos: string;
}

interface Sede {
  _id: string;
  nombre: string;
}

interface Box {
  _id: string;
  nombre: string;
}

interface FiltrosVistaSemanalProps {
  profesionalId?: string;
  sedeId?: string;
  boxId?: string;
  profesionales: Profesional[];
  sedes: Sede[];
  boxes?: Box[];
  onFiltroChange: (filtro: 'profesional' | 'sede' | 'box', valor: string | undefined) => void;
}

export default function FiltrosVistaSemanal({
  profesionalId,
  sedeId,
  boxId,
  profesionales,
  sedes,
  boxes = [],
  onFiltroChange,
}: FiltrosVistaSemanalProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const tieneFiltrosActivos = profesionalId || sedeId || boxId;

  const limpiarFiltros = () => {
    onFiltroChange('profesional', undefined);
    onFiltroChange('sede', undefined);
    onFiltroChange('box', undefined);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtros</span>
          {tieneFiltrosActivos && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              Activos
            </span>
          )}
        </button>

        {tieneFiltrosActivos && (
          <button
            onClick={limpiarFiltros}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profesional
            </label>
            <select
              value={profesionalId || ''}
              onChange={(e) => onFiltroChange('profesional', e.target.value || undefined)}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sede
            </label>
            <select
              value={sedeId || ''}
              onChange={(e) => onFiltroChange('sede', e.target.value || undefined)}
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

          {boxes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Box / Gabinete
              </label>
              <select
                value={boxId || ''}
                onChange={(e) => onFiltroChange('box', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los boxes</option>
                {boxes.map((box) => (
                  <option key={box._id} value={box._id}>
                    {box.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


