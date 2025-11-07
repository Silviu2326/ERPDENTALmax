import { useState } from 'react';
import { Plus, Calendar, FileText, User, X } from 'lucide-react';
import { NotaEvolucion } from '../api/fichasPediatricasAPI';

interface RegistroEvolucionPediatricaProps {
  evolucion: NotaEvolucion[];
  profesionalId: string;
  profesionalNombre?: string;
  onAgregarNota: (nota: Omit<NotaEvolucion, '_id'>) => void;
  readonly?: boolean;
}

export default function RegistroEvolucionPediatrica({
  evolucion,
  profesionalId,
  profesionalNombre,
  onAgregarNota,
  readonly = false,
}: RegistroEvolucionPediatricaProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaNota, setNuevaNota] = useState({
    fecha: new Date().toISOString().split('T')[0],
    nota: '',
    tipo: 'consulta' as NotaEvolucion['tipo'],
    profesionalId,
  });

  const handleAgregar = () => {
    if (!nuevaNota.nota.trim()) return;

    onAgregarNota({
      ...nuevaNota,
      nota: nuevaNota.nota.trim(),
    });

    // Resetear formulario
    setNuevaNota({
      fecha: new Date().toISOString().split('T')[0],
      nota: '',
      tipo: 'consulta',
      profesionalId,
    });
    setMostrarFormulario(false);
  };

  const getTipoColor = (tipo?: NotaEvolucion['tipo']) => {
    switch (tipo) {
      case 'consulta':
        return 'bg-blue-100 text-blue-800';
      case 'control':
        return 'bg-green-100 text-green-800';
      case 'tratamiento':
        return 'bg-purple-100 text-purple-800';
      case 'prevencion':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo?: NotaEvolucion['tipo']) => {
    switch (tipo) {
      case 'consulta':
        return 'Consulta';
      case 'control':
        return 'Control';
      case 'tratamiento':
        return 'Tratamiento';
      case 'prevencion':
        return 'Prevención';
      default:
        return 'Nota';
    }
  };

  // Ordenar por fecha descendente (más recientes primero)
  const evolucionOrdenada = [...evolucion].sort((a, b) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Evolución y Seguimiento</h3>
        {!readonly && (
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={20} />
            Agregar Nota
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <div className="mb-6 p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-200">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Fecha
                </label>
                <input
                  type="date"
                  value={nuevaNota.fecha}
                  onChange={(e) => setNuevaNota({ ...nuevaNota, fecha: e.target.value })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Nota
                </label>
                <select
                  value={nuevaNota.tipo}
                  onChange={(e) => setNuevaNota({ ...nuevaNota, tipo: e.target.value as NotaEvolucion['tipo'] })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                >
                  <option value="consulta">Consulta</option>
                  <option value="control">Control</option>
                  <option value="tratamiento">Tratamiento</option>
                  <option value="prevencion">Prevención</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <FileText size={16} />
                Nota de Evolución
              </label>
              <textarea
                value={nuevaNota.nota}
                onChange={(e) => setNuevaNota({ ...nuevaNota, nota: e.target.value })}
                rows={5}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Describa los hallazgos, el tratamiento realizado y las recomendaciones dadas a los padres..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAgregar}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Agregar Nota
              </button>
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setNuevaNota({
                    fecha: new Date().toISOString().split('T')[0],
                    nota: '',
                    tipo: 'consulta',
                    profesionalId,
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {evolucionOrdenada.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay notas de evolución registradas</p>
        ) : (
          evolucionOrdenada.map((nota, index) => (
            <div
              key={nota._id || index}
              className="p-4 rounded-lg ring-1 ring-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} />
                    <span className="font-medium">
                      {new Date(nota.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(nota.tipo)}`}>
                    {getTipoLabel(nota.tipo)}
                  </span>
                </div>
                {nota.profesionalNombre && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User size={16} />
                    <span>{nota.profesionalNombre}</span>
                  </div>
                )}
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{nota.nota}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



