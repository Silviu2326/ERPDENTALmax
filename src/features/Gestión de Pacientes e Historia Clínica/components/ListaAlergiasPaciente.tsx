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
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus size={20} className="mr-2" />
            Agregar Alergia
          </button>
        )}
      </div>

      {/* Formulario para nueva alergia */}
      {mostrarFormulario && (
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre de la Alergia *
              </label>
              <input
                type="text"
                value={nuevaAlergia.nombre || ''}
                onChange={(e) => setNuevaAlergia({ ...nuevaAlergia, nombre: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                placeholder="Ej: Penicilina, Látex..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
              <select
                value={nuevaAlergia.tipo || 'medicamento'}
                onChange={(e) =>
                  setNuevaAlergia({
                    ...nuevaAlergia,
                    tipo: e.target.value as Alergia['tipo'],
                  })
                }
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">Reacción</label>
            <input
              type="text"
              value={nuevaAlergia.reaccion || ''}
              onChange={(e) => setNuevaAlergia({ ...nuevaAlergia, reaccion: e.target.value })}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
                setNuevaAlergia({
                  nombre: '',
                  tipo: 'medicamento',
                  reaccion: '',
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

      {/* Lista de alergias */}
      {alergias.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">No hay alergias registradas</p>
      ) : (
        <div className="space-y-3">
          {alergias.map((alergia, index) => (
            <div
              key={index}
              className={`ring-1 rounded-xl p-3 ${
                alergia.critica
                  ? 'bg-red-50 ring-red-300'
                  : 'bg-white ring-slate-200'
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{alergia.nombre}</h4>
                      {alergia.critica && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                          <AlertCircle size={12} />
                          Crítica
                        </span>
                      )}
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
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
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      aria-label="Editar alergia"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleEliminar(index)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      aria-label="Eliminar alergia"
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

interface EditarAlergiaProps {
  alergia: Alergia;
  onGuardar: (alergia: Alergia) => void;
  onCancelar: () => void;
}

function EditarAlergia({ alergia, onGuardar, onCancelar }: EditarAlergiaProps) {
  const [editando, setEditando] = useState<Alergia>(alergia);
  const tiposAlergia: Alergia['tipo'][] = ['medicamento', 'material', 'alimento', 'otro'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
          <select
            value={editando.tipo}
            onChange={(e) => setEditando({ ...editando, tipo: e.target.value as Alergia['tipo'] })}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
        <label className="block text-sm font-medium text-slate-700 mb-2">Reacción</label>
        <input
          type="text"
          value={editando.reaccion}
          onChange={(e) => setEditando({ ...editando, reaccion: e.target.value })}
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



