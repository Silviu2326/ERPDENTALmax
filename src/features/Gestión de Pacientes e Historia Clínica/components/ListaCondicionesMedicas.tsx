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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Condición
          </button>
        )}
      </div>

      {/* Formulario para nuevo antecedente */}
      {mostrarFormulario && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Condición *
            </label>
            <input
              type="text"
              value={nuevoAntecedente.nombre || ''}
              onChange={(e) =>
                setNuevoAntecedente({ ...nuevoAntecedente, nombre: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Diabetes, Hipertensión, Cardiopatía..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
            <input
              type="text"
              value={nuevoAntecedente.diagnostico || ''}
              onChange={(e) =>
                setNuevoAntecedente({ ...nuevoAntecedente, diagnostico: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Diagnóstico específico..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              value={nuevoAntecedente.notas || ''}
              onChange={(e) =>
                setNuevoAntecedente({ ...nuevoAntecedente, notas: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <span className="text-sm font-medium text-gray-700">Marcar como crítica</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAgregar}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
        <div className="space-y-2">
          {antecedentes.map((antecedente, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 ${
                antecedente.critica ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'
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
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{antecedente.nombre}</h4>
                      {antecedente.critica && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                          <AlertCircle className="w-3 h-3" />
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
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      aria-label="Editar condición"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEliminar(index)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label="Eliminar condición"
                    >
                      <X className="w-4 h-4" />
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
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          type="text"
          value={editando.nombre}
          onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
        <input
          type="text"
          value={editando.diagnostico}
          onChange={(e) => setEditando({ ...editando, diagnostico: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
        <textarea
          value={editando.notas}
          onChange={(e) => setEditando({ ...editando, notas: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <span className="text-sm font-medium text-gray-700">Crítica</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onGuardar(editando)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Guardar
        </button>
        <button
          onClick={onCancelar}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}


