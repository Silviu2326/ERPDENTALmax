import { useState } from 'react';
import { Plus, X, Edit2, Save, AlertCircle } from 'lucide-react';
import { AntecedenteMedico } from '../api/historiaClinicaApi';

interface ListaCondicionesMedicasProps {
  antecedentes: AntecedenteMedico[];
  onAntecedentesChange: (antecedentes: AntecedenteMedico[]) => void;
}

export default function ListaCondicionesMedicas({
  antecedentes,
  onAntecedentesChange,
}: ListaCondicionesMedicasProps) {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [nuevoAntecedente, setNuevoAntecedente] = useState<Partial<AntecedenteMedico>>({
    nombre: '',
    diagnostico: '',
    notas: '',
    critica: false,
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleAgregar = () => {
    if (!nuevoAntecedente.nombre?.trim()) return;

    const antecedenteCompleto: AntecedenteMedico = {
      nombre: nuevoAntecedente.nombre.trim(),
      diagnostico: nuevoAntecedente.diagnostico?.trim() || '',
      notas: nuevoAntecedente.notas?.trim() || '',
      critica: nuevoAntecedente.critica || false,
    };

    onAntecedentesChange([...antecedentes, antecedenteCompleto]);
    setNuevoAntecedente({
      nombre: '',
      diagnostico: '',
      notas: '',
      critica: false,
    });
    setMostrarFormulario(false);
  };

  const handleEliminar = (index: number) => {
    const nuevosAntecedentes = antecedentes.filter((_, i) => i !== index);
    onAntecedentesChange(nuevosAntecedentes);
  };

  const handleEditar = (index: number) => {
    setEditandoIndex(index);
  };

  const handleGuardarEdicion = (index: number, antecedenteEditado: AntecedenteMedico) => {
    const nuevosAntecedentes = [...antecedentes];
    nuevosAntecedentes[index] = antecedenteEditado;
    onAntecedentesChange(nuevosAntecedentes);
    setEditandoIndex(null);
  };

  const handleCancelarEdicion = () => {
    setEditandoIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Condiciones Médicas</h3>
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus size={20} className="mr-2" />
            Agregar Condición
          </button>
        )}
      </div>

      {/* Formulario para nuevo antecedente */}
      {mostrarFormulario && (
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de la Condición *
            </label>
            <input
              type="text"
              value={nuevoAntecedente.nombre || ''}
              onChange={(e) =>
                setNuevoAntecedente({ ...nuevoAntecedente, nombre: e.target.value })
              }
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Ej: Diabetes, Hipertensión, Cardiopatía..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Diagnóstico</label>
            <input
              type="text"
              value={nuevoAntecedente.diagnostico || ''}
              onChange={(e) =>
                setNuevoAntecedente({ ...nuevoAntecedente, diagnostico: e.target.value })
              }
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Diagnóstico específico..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
            <textarea
              value={nuevoAntecedente.notas || ''}
              onChange={(e) =>
                setNuevoAntecedente({ ...nuevoAntecedente, notas: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              placeholder="Información adicional sobre la condición..."
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={nuevoAntecedente.critica || false}
                onChange={(e) =>
                  setNuevoAntecedente({ ...nuevoAntecedente, critica: e.target.checked })
                }
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-slate-700">Marcar como crítica</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAgregar}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              Agregar
            </button>
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setNuevoAntecedente({
                  nombre: '',
                  diagnostico: '',
                  notas: '',
                  critica: false,
                });
              }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de antecedentes */}
      {antecedentes.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">No hay condiciones médicas registradas</p>
      ) : (
        <div className="space-y-3">
          {antecedentes.map((antecedente, index) => (
            <div
              key={index}
              className={`ring-1 rounded-xl p-3 ${
                antecedente.critica ? 'bg-red-50 ring-red-300' : 'bg-white ring-slate-200'
              }`}
            >
              {editandoIndex === index ? (
                <EditarAntecedente
                  antecedente={antecedente}
                  onGuardar={(antecedenteEditado) =>
                    handleGuardarEdicion(index, antecedenteEditado)
                  }
                  onCancelar={handleCancelarEdicion}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{antecedente.nombre}</h4>
                      {antecedente.critica && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                          <AlertCircle size={12} />
                          Crítica
                        </span>
                      )}
                    </div>
                    {antecedente.diagnostico && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Diagnóstico:</span> {antecedente.diagnostico}
                      </p>
                    )}
                    {antecedente.notas && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Notas:</span> {antecedente.notas}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditar(index)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      aria-label="Editar condición"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleEliminar(index)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      aria-label="Eliminar condición"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface EditarAntecedenteProps {
  antecedente: AntecedenteMedico;
  onGuardar: (antecedente: AntecedenteMedico) => void;
  onCancelar: () => void;
}

function EditarAntecedente({
  antecedente,
  onGuardar,
  onCancelar,
}: EditarAntecedenteProps) {
  const [editando, setEditando] = useState<AntecedenteMedico>(antecedente);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Nombre *</label>
        <input
          type="text"
          value={editando.nombre}
          onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Diagnóstico</label>
        <input
          type="text"
          value={editando.diagnostico}
          onChange={(e) => setEditando({ ...editando, diagnostico: e.target.value })}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Notas</label>
        <textarea
          value={editando.notas}
          onChange={(e) => setEditando({ ...editando, notas: e.target.value })}
          rows={3}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editando.critica}
            onChange={(e) => setEditando({ ...editando, critica: e.target.checked })}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="text-sm font-medium text-slate-700">Crítica</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onGuardar(editando)}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          <Save size={16} />
          Guardar
        </button>
        <button
          onClick={onCancelar}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-all bg-slate-200 text-slate-700 hover:bg-slate-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}



