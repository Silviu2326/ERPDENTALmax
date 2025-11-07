import { useState } from 'react';
import { Save, Plus, X, Pill } from 'lucide-react';
import { HistoriaMedica, MedicacionActual } from '../api/historiaClinicaApi';
import BannerAlertaMedica from './BannerAlertaMedica';
import ListaAlergiasPaciente from './ListaAlergiasPaciente';
import ListaCondicionesMedicas from './ListaCondicionesMedicas';

interface FormularioAntecedentesMedicosProps {
  pacienteId: string;
  historiaMedica: HistoriaMedica;
  onUpdate: (historiaMedica: HistoriaMedica) => void;
}

export default function FormularioAntecedentesMedicos({
  pacienteId,
  historiaMedica,
  onUpdate,
}: FormularioAntecedentesMedicosProps) {
  const [formData, setFormData] = useState<HistoriaMedica>(historiaMedica);
  const [nuevaMedicacion, setNuevaMedicacion] = useState<Partial<MedicacionActual>>({
    nombre: '',
    dosis: '',
  });
  const [mostrarFormularioMedicacion, setMostrarFormularioMedicacion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(
    null
  );

  const handleGuardar = async () => {
    setGuardando(true);
    setMensaje(null);
    try {
      // La función onUpdate debería manejar la llamada a la API
      onUpdate(formData);
      setMensaje({ tipo: 'success', texto: 'Historia médica actualizada correctamente' });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje({
        tipo: 'error',
        texto: err instanceof Error ? err.message : 'Error al guardar la historia médica',
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleAlergiasChange = (alergias: typeof formData.alergias) => {
    setFormData({ ...formData, alergias });
  };

  const handleAntecedentesChange = (antecedentes: typeof formData.antecedentes) => {
    setFormData({ ...formData, antecedentes });
  };

  const handleAgregarMedicacion = () => {
    if (!nuevaMedicacion.nombre?.trim()) return;

    const medicacionCompleta: MedicacionActual = {
      nombre: nuevaMedicacion.nombre.trim(),
      dosis: nuevaMedicacion.dosis?.trim() || '',
    };

    setFormData({
      ...formData,
      medicacionActual: [...formData.medicacionActual, medicacionCompleta],
    });
    setNuevaMedicacion({ nombre: '', dosis: '' });
    setMostrarFormularioMedicacion(false);
  };

  const handleEliminarMedicacion = (index: number) => {
    const nuevaMedicacion = formData.medicacionActual.filter((_, i) => i !== index);
    setFormData({ ...formData, medicacionActual: nuevaMedicacion });
  };

  return (
    <div className="space-y-6">
      {/* Banner de alertas críticas */}
      <BannerAlertaMedica
        alergias={formData.alergias}
        antecedentes={formData.antecedentes}
      />

      {/* Mensaje de éxito/error */}
      {mensaje && (
        <div
          className={`px-4 py-3 rounded-lg ${
            mensaje.tipo === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Sección de Alergias */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <ListaAlergiasPaciente
          alergias={formData.alergias}
          onAlergiasChange={handleAlergiasChange}
        />
      </div>

      {/* Sección de Condiciones Médicas */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <ListaCondicionesMedicas
          antecedentes={formData.antecedentes}
          onAntecedentesChange={handleAntecedentesChange}
        />
      </div>

      {/* Sección de Medicación Actual */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pill size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Medicación Actual</h3>
          </div>
          {!mostrarFormularioMedicacion && (
            <button
              onClick={() => setMostrarFormularioMedicacion(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Plus size={20} className="mr-2" />
              Agregar Medicación
            </button>
          )}
        </div>

        {/* Formulario para nueva medicación */}
        {mostrarFormularioMedicacion && (
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4 space-y-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Medicamento *
                </label>
                <input
                  type="text"
                  value={nuevaMedicacion.nombre || ''}
                  onChange={(e) =>
                    setNuevaMedicacion({ ...nuevaMedicacion, nombre: e.target.value })
                  }
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Ej: Metformina, Aspirina..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dosis</label>
                <input
                  type="text"
                  value={nuevaMedicacion.dosis || ''}
                  onChange={(e) =>
                    setNuevaMedicacion({ ...nuevaMedicacion, dosis: e.target.value })
                  }
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  placeholder="Ej: 500mg 2 veces al día..."
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAgregarMedicacion}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Agregar
              </button>
              <button
                onClick={() => {
                  setMostrarFormularioMedicacion(false);
                  setNuevaMedicacion({ nombre: '', dosis: '' });
                }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de medicación */}
        {formData.medicacionActual.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No hay medicación registrada</p>
        ) : (
          <div className="space-y-3">
            {formData.medicacionActual.map((medicacion, index) => (
              <div
                key={index}
                className="bg-slate-50 ring-1 ring-slate-200 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{medicacion.nombre}</h4>
                  {medicacion.dosis && (
                    <p className="text-sm text-gray-600 mt-1">Dosis: {medicacion.dosis}</p>
                  )}
                </div>
                <button
                  onClick={() => handleEliminarMedicacion(index)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  aria-label="Eliminar medicación"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Notas Generales */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notas Generales
          </label>
          <textarea
            value={formData.notasGenerales || ''}
            onChange={(e) =>
              setFormData({ ...formData, notasGenerales: e.target.value })
            }
            rows={4}
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            placeholder="Notas adicionales sobre la historia médica del paciente..."
          />
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} className="mr-2" />
          {guardando ? 'Guardando...' : 'Guardar Historia Médica'}
        </button>
      </div>
    </div>
  );
}



