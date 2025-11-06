import { useState } from 'react';
import { Plus, X, Edit2, Save, AlertCircle } from 'lucide-react';
import { Alergia } from '../api/historiaClinicaApi';

interface ListaAlergiasPacienteProps {
  alergias: Alergia[];
  onAlergiasChange: (alergias: Alergia[]) => void;
}

export default function ListaAlergiasPaciente({
  alergias,
  onAlergiasChange,
}: ListaAlergiasPacienteProps) {
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [nuevaAlergia, setNuevaAlergia] = useState<Partial<Alergia>>({
    nombre: '',
    tipo: 'medicamento',
    reaccion: '',
    critica: false,
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const tiposAlergia: Alergia['tipo'][] = ['medicamento', 'material', 'alimento', 'otro'];

  const handleAgregar = () => {
    if (!nuevaAlergia.nombre?.trim()) return;

    const alergiaCompleta: Alergia = {
      nombre: nuevaAlergia.nombre.trim(),
      tipo: nuevaAlergia.tipo || 'medicamento',
      reaccion: nuevaAlergia.reaccion?.trim() || '',
      critica: nuevaAlergia.critica || false,
    };

    onAlergiasChange([...alergias, alergiaCompleta]);
    setNuevaAlergia({
      nombre: '',
      tipo: 'medicamento',
      reaccion: '',
      critica: false,
    });
    setMostrarFormulario(false);
  };

  const handleEliminar = (index: number) => {
    const nuevasAlergias = alergias.filter((_, i) => i !== index);
    onAlergiasChange(nuevasAlergias);
  };

  const handleEditar = (index: number) => {
    setEditandoIndex(index);
  };

  const handleGuardarEdicion = (index: number, alergiaEditada: Alergia) => {
    const nuevasAlergias = [...alergias];
    nuevasAlergias[index] = alergiaEditada;
    onAlergiasChange(nuevasAlergias);
    setEditandoIndex(null);
  };

  const handleCancelarEdicion = () => {
    setEditandoIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Alergias</h3>
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Alergia
          </button>
        )}
      </div>

      {/* Formulario para nueva alergia */}
      {mostrarFormulario && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Alergia *
              </label>
              <input
                type="text"
                value={nuevaAlergia.nombre || ''}
                onChange={(e) => setNuevaAlergia({ ...nuevaAlergia, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Penicilina, Látex..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={nuevaAlergia.tipo || 'medicamento'}
                onChange={(e) =>
                  setNuevaAlergia({
                    ...nuevaAlergia,
                    tipo: e.target.value as Alergia['tipo'],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {tiposAlergia.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reacción</label>
            <input
              type="text"
              value={nuevaAlergia.reaccion || ''}
              onChange={(e) => setNuevaAlergia({ ...nuevaAlergia, reaccion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Anafilaxia, Urticaria..."
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={nuevaAlergia.critica || false}
                onChange={(e) =>
                  setNuevaAlergia({ ...nuevaAlergia, critica: e.target.checked })
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
                setNuevaAlergia({
                  nombre: '',
                  tipo: 'medicamento',
                  reaccion: '',
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

      {/* Lista de alergias */}
      {alergias.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">No hay alergias registradas</p>
      ) : (
        <div className="space-y-2">
          {alergias.map((alergia, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 ${
                alergia.critica
                  ? 'bg-red-50 border-red-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              {editandoIndex === index ? (
                <EditarAlergia
                  alergia={alergia}
                  onGuardar={(alergiaEditada) => handleGuardarEdicion(index, alergiaEditada)}
                  onCancelar={handleCancelarEdicion}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{alergia.nombre}</h4>
                      {alergia.critica && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                          <AlertCircle className="w-3 h-3" />
                          Crítica
                        </span>
                      )}
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {alergia.tipo}
                      </span>
                    </div>
                    {alergia.reaccion && (
                      <p className="text-sm text-gray-600 mt-1">Reacción: {alergia.reaccion}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditar(index)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      aria-label="Editar alergia"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEliminar(index)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label="Eliminar alergia"
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

interface EditarAlergiaProps {
  alergia: Alergia;
  onGuardar: (alergia: Alergia) => void;
  onCancelar: () => void;
}

function EditarAlergia({ alergia, onGuardar, onCancelar }: EditarAlergiaProps) {
  const [editando, setEditando] = useState<Alergia>(alergia);
  const tiposAlergia: Alergia['tipo'][] = ['medicamento', 'material', 'alimento', 'otro'];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={editando.tipo}
            onChange={(e) => setEditando({ ...editando, tipo: e.target.value as Alergia['tipo'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {tiposAlergia.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reacción</label>
        <input
          type="text"
          value={editando.reaccion}
          onChange={(e) => setEditando({ ...editando, reaccion: e.target.value })}
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


