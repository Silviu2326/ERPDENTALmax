import { useState } from 'react';
import { Plus, Edit2, Trash2, Pill } from 'lucide-react';
import { MedicacionPrescrita, Postoperatorio, ActualizarIndicacionesRequest } from '../api/postoperatorioApi';

interface ListaMedicacionPrescritaProps {
  postoperatorio: Postoperatorio;
  onActualizar: (datos: ActualizarIndicacionesRequest) => Promise<void>;
  loading?: boolean;
}

export default function ListaMedicacionPrescrita({
  postoperatorio,
  onActualizar,
  loading = false,
}: ListaMedicacionPrescritaProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [medicacionEditando, setMedicacionEditando] = useState<number | null>(null);
  const [formData, setFormData] = useState<MedicacionPrescrita>({
    nombre: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
  });

  const medicaciones = postoperatorio.medicacionPrescrita || [];

  const handleAgregar = () => {
    setMedicacionEditando(null);
    setFormData({ nombre: '', dosis: '', frecuencia: '', duracion: '' });
    setMostrarFormulario(true);
  };

  const handleEditar = (index: number) => {
    setMedicacionEditando(index);
    setFormData(medicaciones[index]);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (index: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta medicación?')) {
      return;
    }

    const nuevasMedicaciones = medicaciones.filter((_, i) => i !== index);
    await onActualizar({
      indicacionesGenerales: postoperatorio.indicacionesGenerales,
      medicacionPrescrita: nuevasMedicaciones,
    });
  };

  const handleGuardar = async () => {
    if (!formData.nombre.trim() || !formData.dosis.trim() || !formData.frecuencia.trim() || !formData.duracion.trim()) {
      alert('Por favor, complete todos los campos');
      return;
    }

    let nuevasMedicaciones: MedicacionPrescrita[];
    if (medicacionEditando !== null) {
      // Editar existente
      nuevasMedicaciones = [...medicaciones];
      nuevasMedicaciones[medicacionEditando] = formData;
    } else {
      // Agregar nuevo
      nuevasMedicaciones = [...medicaciones, formData];
    }

    await onActualizar({
      indicacionesGenerales: postoperatorio.indicacionesGenerales,
      medicacionPrescrita: nuevasMedicaciones,
    });

    setMostrarFormulario(false);
    setMedicacionEditando(null);
    setFormData({ nombre: '', dosis: '', frecuencia: '', duracion: '' });
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setMedicacionEditando(null);
    setFormData({ nombre: '', dosis: '', frecuencia: '', duracion: '' });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Medicación Prescrita</h3>
        <button
          onClick={handleAgregar}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Agregar Medicación
        </button>
      </div>

      {/* Formulario de Medicación */}
      {mostrarFormulario && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">
            {medicacionEditando !== null ? 'Editar Medicación' : 'Nueva Medicación'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del Medicamento *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                placeholder="Ej: Ibuprofeno"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Dosis *</label>
              <input
                type="text"
                value={formData.dosis}
                onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                placeholder="Ej: 600mg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Frecuencia *</label>
              <input
                type="text"
                value={formData.frecuencia}
                onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                placeholder="Ej: Cada 8 horas"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Duración *</label>
              <input
                type="text"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                placeholder="Ej: 5 días"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleGuardar}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={handleCancelar}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Medicaciones */}
      {medicaciones.length === 0 ? (
        <div className="bg-white shadow-sm rounded-xl p-8 text-center">
          <Pill size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay medicación prescrita</h3>
          <p className="text-gray-600 mb-4">Agregue medicación prescrita para el paciente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {medicaciones.map((medicacion, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Pill size={20} className="text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{medicacion.nombre}</h4>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Dosis:</span> {medicacion.dosis}
                  </div>
                  <div>
                    <span className="font-medium">Frecuencia:</span> {medicacion.frecuencia}
                  </div>
                  <div>
                    <span className="font-medium">Duración:</span> {medicacion.duracion}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEditar(index)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Editar"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleEliminar(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Eliminar"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



