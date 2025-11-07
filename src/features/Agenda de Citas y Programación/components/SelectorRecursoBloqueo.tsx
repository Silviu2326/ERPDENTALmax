import { useState, useEffect } from 'react';
import { Building2, User } from 'lucide-react';
import { obtenerSalas, Sala } from '../api/bloqueosApi';
import { obtenerProfesionales, Profesional } from '../api/citasApi';

interface SelectorRecursoBloqueoProps {
  tipo: 'SALA' | 'PROFESIONAL' | '';
  recursoId: string;
  sedeId?: string;
  onTipoChange: (tipo: 'SALA' | 'PROFESIONAL') => void;
  onRecursoChange: (recursoId: string) => void;
  disabled?: boolean;
}

export default function SelectorRecursoBloqueo({
  tipo,
  recursoId,
  sedeId,
  onTipoChange,
  onRecursoChange,
  disabled = false,
}: SelectorRecursoBloqueoProps) {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tipo === 'SALA' && sedeId) {
      cargarSalas();
    } else if (tipo === 'PROFESIONAL') {
      cargarProfesionales();
    }
  }, [tipo, sedeId]);

  const cargarSalas = async () => {
    setLoading(true);
    try {
      const datos = await obtenerSalas(sedeId);
      setSalas(datos);
    } catch (error) {
      console.error('Error al cargar salas:', error);
      // Datos mock para desarrollo
      setSalas([
        { _id: '1', numero: '1', nombre: 'Sillón 1', sede: { _id: sedeId || '1', nombre: 'Sede Central' } },
        { _id: '2', numero: '2', nombre: 'Sillón 2', sede: { _id: sedeId || '1', nombre: 'Sede Central' } },
        { _id: '3', numero: '3', nombre: 'Sillón 3', sede: { _id: sedeId || '1', nombre: 'Sede Central' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const cargarProfesionales = async () => {
    setLoading(true);
    try {
      const datos = await obtenerProfesionales();
      setProfesionales(datos);
    } catch (error) {
      console.error('Error al cargar profesionales:', error);
      // Datos mock para desarrollo
      setProfesionales([
        { _id: '1', nombre: 'Juan', apellidos: 'Pérez', rol: 'Odontólogo', activo: true },
        { _id: '2', nombre: 'María', apellidos: 'García', rol: 'Odontólogo', activo: true },
        { _id: '3', nombre: 'Carlos', apellidos: 'López', rol: 'Higienista', activo: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de Tipo */}
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          Tipo de Recurso *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onTipoChange('SALA');
              onRecursoChange('');
            }}
            disabled={disabled}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl ring-1 transition-all ${
              tipo === 'SALA'
                ? 'ring-blue-300 bg-blue-50 text-blue-700'
                : 'ring-slate-300 bg-white text-slate-700 hover:ring-slate-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Building2 className="w-5 h-5" />
            <span>Sala / Sillón</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onTipoChange('PROFESIONAL');
              onRecursoChange('');
            }}
            disabled={disabled}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl ring-1 transition-all ${
              tipo === 'PROFESIONAL'
                ? 'ring-blue-300 bg-blue-50 text-blue-700'
                : 'ring-slate-300 bg-white text-slate-700 hover:ring-slate-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <User className="w-5 h-5" />
            <span>Profesional</span>
          </button>
        </div>
      </div>

      {/* Selector de Recurso según el tipo */}
      {tipo && (
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
            {tipo === 'SALA' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
            <span>
              {tipo === 'SALA' ? 'Sala / Sillón *' : 'Profesional *'}
            </span>
          </label>
          {loading ? (
            <div className="px-3 py-2.5 ring-1 ring-slate-300 rounded-xl text-slate-500 text-center bg-white">
              Cargando...
            </div>
          ) : (
            <select
              value={recursoId}
              onChange={(e) => onRecursoChange(e.target.value)}
              required
              disabled={disabled}
              className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 disabled:opacity-50"
            >
              <option value="">Seleccionar {tipo === 'SALA' ? 'sala' : 'profesional'}</option>
              {tipo === 'SALA'
                ? salas.map((sala) => (
                    <option key={sala._id} value={sala._id}>
                      {sala.nombre || `Sillón ${sala.numero}`} - {sala.sede.nombre}
                    </option>
                  ))
                : profesionales.map((prof) => (
                    <option key={prof._id} value={prof._id}>
                      {prof.nombre} {prof.apellidos} - {prof.rol}
                    </option>
                  ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}



