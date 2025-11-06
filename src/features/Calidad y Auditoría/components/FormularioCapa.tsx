import { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import {
  Capa,
  NuevaCapa,
  ActualizarCapa,
  AccionCorrectiva,
  AccionPreventiva,
  VerificacionEfectividad,
} from '../api/capasApi';

interface FormularioCapaProps {
  capa?: Capa;
  onGuardar: (datos: NuevaCapa | ActualizarCapa) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
  clinicaId?: string;
  clinicas?: Array<{ _id: string; nombre: string }>;
  responsables?: Array<{ _id: string; nombre: string; apellidos?: string }>;
  modoEdicion?: boolean;
}

export default function FormularioCapa({
  capa,
  onGuardar,
  onCancelar,
  loading = false,
  clinicaId,
  clinicas = [],
  responsables = [],
  modoEdicion = false,
}: FormularioCapaProps) {
  const [formData, setFormData] = useState({
    titulo: capa?.titulo || '',
    descripcion_incidente: capa?.descripcion_incidente || '',
    fecha_deteccion: capa?.fecha_deteccion
      ? new Date(capa.fecha_deteccion).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    fuente: (capa?.fuente || 'Auditoría Interna') as Capa['fuente'],
    id_clinica: capa?.id_clinica || clinicaId || '',
  });

  const [analisisCausaRaiz, setAnalisisCausaRaiz] = useState(
    capa?.analisis_causa_raiz || ''
  );

  const [accionCorrectiva, setAccionCorrectiva] = useState<AccionCorrectiva | null>(
    capa?.accion_correctiva || null
  );

  const [accionPreventiva, setAccionPreventiva] = useState<AccionPreventiva | null>(
    capa?.accion_preventiva || null
  );

  const [verificacionEfectividad, setVerificacionEfectividad] = useState<VerificacionEfectividad | null>(
    capa?.verificacion_efectividad || null
  );

  const [error, setError] = useState<string | null>(null);

  const fuentes: Capa['fuente'][] = [
    'Auditoría Interna',
    'Queja de Paciente',
    'Revisión de Equipo',
    'Otro',
  ];

  const estados: Capa['estado'][] = [
    'Abierta',
    'En Investigación',
    'Acciones Definidas',
    'En Implementación',
    'Pendiente de Verificación',
    'Cerrada',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!formData.descripcion_incidente.trim()) {
      setError('La descripción del incidente es obligatoria');
      return;
    }

    if (!formData.id_clinica) {
      setError('La clínica es obligatoria');
      return;
    }

    try {
      if (capa && modoEdicion) {
        // Actualizar CAPA existente
        const datosActualizacion: ActualizarCapa = {
          titulo: formData.titulo,
          descripcion_incidente: formData.descripcion_incidente,
          fecha_deteccion: formData.fecha_deteccion,
          fuente: formData.fuente,
          analisis_causa_raiz: analisisCausaRaiz || undefined,
          accion_correctiva: accionCorrectiva || undefined,
          accion_preventiva: accionPreventiva || undefined,
          verificacion_efectividad: verificacionEfectividad || undefined,
        };
        await onGuardar(datosActualizacion);
      } else {
        // Crear nueva CAPA
        const datosNuevaCapa: NuevaCapa = {
          titulo: formData.titulo,
          descripcion_incidente: formData.descripcion_incidente,
          fecha_deteccion: formData.fecha_deteccion,
          fuente: formData.fuente,
          id_clinica: formData.id_clinica,
        };
        await onGuardar(datosNuevaCapa);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la CAPA');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Información Básica */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información del Incidente
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Ej: No conformidad en proceso de esterilización"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuente *
            </label>
            <select
              value={formData.fuente}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fuente: e.target.value as Capa['fuente'],
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {fuentes.map((fuente) => (
                <option key={fuente} value={fuente}>
                  {fuente}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Detección *
            </label>
            <input
              type="date"
              value={formData.fecha_deteccion}
              onChange={(e) =>
                setFormData({ ...formData, fecha_deteccion: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {clinicas.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clínica *
              </label>
              <select
                value={formData.id_clinica}
                onChange={(e) =>
                  setFormData({ ...formData, id_clinica: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!!clinicaId}
              >
                <option value="">Seleccionar clínica</option>
                {clinicas.map((clinica) => (
                  <option key={clinica._id} value={clinica._id}>
                    {clinica.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Incidente *
            </label>
            <textarea
              value={formData.descripcion_incidente}
              onChange={(e) =>
                setFormData({ ...formData, descripcion_incidente: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Describe detalladamente el incidente o no conformidad detectada..."
            />
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancelar}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <div className="flex items-center gap-2">
            <X className="w-5 h-5" />
            <span>Cancelar</span>
          </div>
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <div className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            <span>{loading ? 'Guardando...' : 'Guardar'}</span>
          </div>
        </button>
      </div>
    </form>
  );
}


