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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Medicación Prescrita</h3>
        <button
          onClick={handleAgregar}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Medicación
        </button>
      </div>

      {/* Formulario de Medicación */}
      {mostrarFormulario && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-4">
            {medicacionEditando !== null ? 'Editar Medicación' : 'Nueva Medicación'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Medicamento *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Ibuprofeno"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosis *</label>
              <input
                type="text"
                value={formData.dosis}
                onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 600mg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia *</label>
              <input
                type="text"
                value={formData.frecuencia}
                onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Cada 8 horas"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración *</label>
              <input
                type="text"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 5 días"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleGuardar}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={handleCancelar}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Medicaciones */}
      {medicaciones.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Pill className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No hay medicación prescrita</p>
        </div>
      ) : (
        <div className="space-y-3">
          {medicaciones.map((medicacion, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-800">{medicacion.nombre}</h4>
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
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEliminar(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


