import { useState, useEffect } from 'react';
import { Search, Building2 } from 'lucide-react';
import { obtenerLaboratorios, Laboratorio } from '../api/laboratoriosApi';

interface SelectorLaboratorioProps {
  laboratorioSeleccionado: Laboratorio | null;
  onLaboratorioSeleccionado: (laboratorio: Laboratorio | null) => void;
  disabled?: boolean;
}

export default function SelectorLaboratorio({
  laboratorioSeleccionado,
  onLaboratorioSeleccionado,
  disabled = false,
}: SelectorLaboratorioProps) {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarLaboratorios();
  }, []);

  const cargarLaboratorios = async () => {
    setLoading(true);
    try {
      const lista = await obtenerLaboratorios(true); // Solo activos
      setLaboratorios(lista);
    } catch (error) {
      console.error('Error al cargar laboratorios:', error);
    } finally {
      setLoading(false);
    }
  };

  const laboratoriosFiltrados = laboratorios.filter((lab) =>
    lab.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    lab.personaContacto?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSeleccionar = (laboratorio: Laboratorio) => {
    onLaboratorioSeleccionado(laboratorio);
    setBusqueda('');
    setMostrarLista(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Laboratorio <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Building2 className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={laboratorioSeleccionado?.nombre || busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setMostrarLista(true);
            if (!e.target.value) {
              onLaboratorioSeleccionado(null);
            }
          }}
          onFocus={() => setMostrarLista(true)}
          onBlur={() => setTimeout(() => setMostrarLista(false), 200)}
          placeholder="Buscar laboratorio..."
          disabled={disabled}
          className="block w-full pl-10 pr-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
        />
        {!laboratorioSeleccionado && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
        )}
      </div>

      {mostrarLista && busqueda && laboratoriosFiltrados.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white ring-1 ring-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {laboratoriosFiltrados.map((laboratorio) => (
            <button
              key={laboratorio._id}
              type="button"
              onClick={() => handleSeleccionar(laboratorio)}
              className="w-full text-left px-4 py-2 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none transition-colors border-b border-slate-100 last:border-b-0"
            >
              <div className="font-medium text-slate-900">{laboratorio.nombre}</div>
              {laboratorio.personaContacto && (
                <div className="text-sm text-slate-500">{laboratorio.personaContacto}</div>
              )}
              {laboratorio.telefono && (
                <div className="text-xs text-slate-400">{laboratorio.telefono}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {laboratorioSeleccionado && (
        <div className="mt-2 p-3 bg-blue-50 rounded-xl ring-1 ring-blue-200/70">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-900">{laboratorioSeleccionado.nombre}</div>
              {laboratorioSeleccionado.personaContacto && (
                <div className="text-sm text-slate-600">
                  Contacto: {laboratorioSeleccionado.personaContacto}
                </div>
              )}
              {laboratorioSeleccionado.email && (
                <div className="text-xs text-slate-500">{laboratorioSeleccionado.email}</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onLaboratorioSeleccionado(null)}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
              disabled={disabled}
            >
              Cambiar
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p className="mt-1 text-sm text-slate-500">Cargando laboratorios...</p>
      )}
    </div>
  );
}



