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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Nueva Receta</h2>
        <p className="text-gray-600">Paciente: <span className="font-semibold">{pacienteNombre}</span></p>
      </div>

      {/* Formulario para agregar medicamento */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={dosis}
                onChange={(e) => setDosis(e.target.value)}
                placeholder="Ej: 500mg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frecuencia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={frecuencia}
                onChange={(e) => setFrecuencia(e.target.value)}
                placeholder="Ej: Cada 8 horas"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                placeholder="Ej: 7 días"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indicaciones Específicas (opcional)
            </label>
            <textarea
              value={indicacionesEspecificas}
              onChange={(e) => setIndicacionesEspecificas(e.target.value)}
              placeholder="Indicaciones específicas para este medicamento..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAgregarMedicamento}
            disabled={!medicamentoActual || !dosis || !frecuencia || !duracion}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
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
              className="w-full md:w-auto px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
            >
              <X className="w-5 h-5" />
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
          <div className="space-y-3">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Indicaciones Generales (opcional)
        </label>
        <textarea
          value={indicacionesGenerales}
          onChange={(e) => setIndicacionesGenerales(e.target.value)}
          placeholder="Instrucciones generales para el paciente sobre la receta completa..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          onClick={onCancelar}
          disabled={loading}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardarReceta}
          disabled={loading || medicamentos.length === 0}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Guardar Receta</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}


