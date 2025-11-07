import { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import BuscadorMedicamentos from './BuscadorMedicamentos';
import ItemMedicamentoReceta from './ItemMedicamentoReceta';
import { Medicamento, MedicamentoReceta } from '../api/recetasApi';

interface FormularioCrearRecetaProps {
  pacienteId: string;
  pacienteNombre: string;
  onGuardar: (medicamentos: MedicamentoReceta[], indicacionesGenerales: string) => void;
  onCancelar: () => void;
  loading?: boolean;
}

export default function FormularioCrearReceta({
  pacienteId,
  pacienteNombre,
  onGuardar,
  onCancelar,
  loading = false,
}: FormularioCrearRecetaProps) {
  const [medicamentos, setMedicamentos] = useState<MedicamentoReceta[]>([]);
  const [medicamentoActual, setMedicamentoActual] = useState<Medicamento | null>(null);
  const [dosis, setDosis] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [duracion, setDuracion] = useState('');
  const [indicacionesEspecificas, setIndicacionesEspecificas] = useState('');
  const [indicacionesGenerales, setIndicacionesGenerales] = useState('');
  const [indiceEdicion, setIndiceEdicion] = useState<number | null>(null);

  const handleMedicamentoSeleccionado = (medicamento: Medicamento) => {
    setMedicamentoActual(medicamento);
  };

  const handleAgregarMedicamento = () => {
    if (!medicamentoActual || !dosis || !frecuencia || !duracion) {
      alert('Por favor, completa todos los campos obligatorios del medicamento');
      return;
    }

    const nuevoMedicamento: MedicamentoReceta = {
      nombre: medicamentoActual.nombre_comercial || medicamentoActual.nombre_generico,
      dosis,
      frecuencia,
      duracion,
      indicaciones_especificas: indicacionesEspecificas || undefined,
    };

    if (indiceEdicion !== null) {
      // Editar medicamento existente
      const nuevosMedicamentos = [...medicamentos];
      nuevosMedicamentos[indiceEdicion] = nuevoMedicamento;
      setMedicamentos(nuevosMedicamentos);
      setIndiceEdicion(null);
    } else {
      // Agregar nuevo medicamento
      setMedicamentos([...medicamentos, nuevoMedicamento]);
    }

    // Limpiar formulario
    setMedicamentoActual(null);
    setDosis('');
    setFrecuencia('');
    setDuracion('');
    setIndicacionesEspecificas('');
  };

  const handleEliminarMedicamento = (indice: number) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== indice));
  };

  const handleEditarMedicamento = (indice: number) => {
    const medicamento = medicamentos[indice];
    setIndiceEdicion(indice);
    setDosis(medicamento.dosis);
    setFrecuencia(medicamento.frecuencia);
    setDuracion(medicamento.duracion);
    setIndicacionesEspecificas(medicamento.indicaciones_especificas || '');
    // Nota: En una implementación completa, deberías buscar el medicamento original
    // Por ahora, asumimos que el nombre es suficiente
    setMedicamentoActual({
      nombre_generico: medicamento.nombre,
    });
  };

  const handleGuardarReceta = () => {
    if (medicamentos.length === 0) {
      alert('Debes agregar al menos un medicamento a la receta');
      return;
    }

    onGuardar(medicamentos, indicacionesGenerales);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Crear Nueva Receta</h2>
        <p className="text-sm text-gray-600">Paciente: <span className="font-semibold">{pacienteNombre}</span></p>
      </div>

      {/* Formulario para agregar medicamento */}
      <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {indiceEdicion !== null ? 'Editar Medicamento' : 'Agregar Medicamento'}
        </h3>

        <div className="space-y-4">
          <BuscadorMedicamentos
            onMedicamentoSeleccionado={handleMedicamentoSeleccionado}
            placeholder="Buscar medicamento por nombre genérico o comercial..."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dosis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={dosis}
                onChange={(e) => setDosis(e.target.value)}
                placeholder="Ej: 500mg"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Frecuencia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={frecuencia}
                onChange={(e) => setFrecuencia(e.target.value)}
                placeholder="Ej: Cada 8 horas"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duración <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                placeholder="Ej: 7 días"
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Indicaciones Específicas (opcional)
            </label>
            <textarea
              value={indicacionesEspecificas}
              onChange={(e) => setIndicacionesEspecificas(e.target.value)}
              placeholder="Indicaciones específicas para este medicamento..."
              rows={2}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            />
          </div>

          <button
            onClick={handleAgregarMedicamento}
            disabled={!medicamentoActual || !dosis || !frecuencia || !duracion}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            <span>{indiceEdicion !== null ? 'Actualizar Medicamento' : 'Agregar a la Receta'}</span>
          </button>

          {indiceEdicion !== null && (
            <button
              onClick={() => {
                setIndiceEdicion(null);
                setMedicamentoActual(null);
                setDosis('');
                setFrecuencia('');
                setDuracion('');
                setIndicacionesEspecificas('');
              }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <X size={20} />
              <span>Cancelar Edición</span>
            </button>
          )}
        </div>
      </div>

      {/* Lista de medicamentos agregados */}
      {medicamentos.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Medicamentos en la Receta ({medicamentos.length})
          </h3>
          <div className="space-y-4">
            {medicamentos.map((medicamento, index) => (
              <ItemMedicamentoReceta
                key={index}
                medicamento={medicamento}
                indice={index}
                onEliminar={handleEliminarMedicamento}
                onEditar={handleEditarMedicamento}
                editable={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Indicaciones generales */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Indicaciones Generales (opcional)
        </label>
        <textarea
          value={indicacionesGenerales}
          onChange={(e) => setIndicacionesGenerales(e.target.value)}
          placeholder="Instrucciones generales para el paciente sobre la receta completa..."
          rows={4}
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={onCancelar}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardarReceta}
          disabled={loading || medicamentos.length === 0}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Guardar Receta</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}



