import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import BuscadorPacientes from './BuscadorPacientes';
import SelectorLaboratorio from './SelectorLaboratorio';
import UploaderArchivosAdjuntos from './UploaderArchivosAdjuntos';
import { CrearOrdenProtesisData, Protesis } from '../api/protesisApi';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  dni?: string;
}

interface FormularioOrdenProtesisProps {
  orden?: Protesis;
  onGuardar: (orden: CrearOrdenProtesisData) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

const TIPOS_PROTESIS = [
  'Corona',
  'Puente',
  'Implante',
  'Prótesis Removible',
  'Prótesis Fija',
  'Carilla',
  'Inlay/Onlay',
];

const MATERIALES = [
  'Zirconio',
  'Cerámica',
  'Metal-Cerámica',
  'Resina',
  'PMMA',
  'Titanio',
];

const COLORES = [
  'A1', 'A2', 'A3', 'A3.5', 'A4',
  'B1', 'B2', 'B3', 'B4',
  'C1', 'C2', 'C3', 'C4',
  'D2', 'D3', 'D4',
];

export default function FormularioOrdenProtesis({
  orden,
  onGuardar,
  onCancelar,
  loading = false,
}: FormularioOrdenProtesisProps) {
  const { user } = useAuth();
  const [paciente, setPaciente] = useState<Paciente | null>(
    orden?.paciente
      ? {
          _id: orden.paciente._id,
          nombre: orden.paciente.nombre,
          apellidos: orden.paciente.apellidos,
          dni: orden.paciente.dni,
        }
      : null
  );
  const [laboratorio, setLaboratorio] = useState<any>(orden?.laboratorio || null);
  const [tratamientoId, setTratamientoId] = useState(orden?.tratamiento._id || '');
  const [tipoProtesis, setTipoProtesis] = useState(orden?.tipoProtesis || '');
  const [material, setMaterial] = useState(orden?.material || '');
  const [color, setColor] = useState(orden?.color || '');
  const [fechaPrevistaEntrega, setFechaPrevistaEntrega] = useState(
    orden?.fechaPrevistaEntrega
      ? new Date(orden.fechaPrevistaEntrega).toISOString().split('T')[0]
      : ''
  );
  const [notasClinica, setNotasClinica] = useState(orden?.notasClinica || '');
  const [archivos, setArchivos] = useState(orden?.archivosAdjuntos || []);
  const [subiendoArchivos, setSubiendoArchivos] = useState(false);

  const handleGuardar = async () => {
    if (!paciente || !laboratorio || !tipoProtesis || !material || !color) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (!tratamientoId) {
      alert('Por favor, seleccione un tratamiento asociado');
      return;
    }

    const nuevaOrden: CrearOrdenProtesisData = {
      pacienteId: paciente._id,
      tratamientoId: tratamientoId,
      laboratorioId: laboratorio._id,
      tipoProtesis,
      material,
      color,
      fechaPrevistaEntrega: fechaPrevistaEntrega || undefined,
      notasClinica: notasClinica || undefined,
      especificaciones: {
        // Campos adicionales pueden ir aquí
      },
    };

    try {
      await onGuardar(nuevaOrden);
    } catch (error) {
      console.error('Error al guardar orden:', error);
      alert('Error al guardar la orden. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSubirArchivos = async (files: File[]) => {
    if (!orden?._id || files.length === 0) return;

    setSubiendoArchivos(true);
    try {
      // En producción, esto llamaría a la API real
      // await subirArchivoProtesis(orden._id, files);
      alert('Funcionalidad de subida de archivos pendiente de implementar');
    } catch (error) {
      console.error('Error al subir archivos:', error);
      alert('Error al subir los archivos');
    } finally {
      setSubiendoArchivos(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {orden ? 'Editar Orden de Prótesis' : 'Nueva Orden de Prótesis'}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paciente <span className="text-red-500">*</span>
          </label>
          <BuscadorPacientes
            pacienteSeleccionado={paciente}
            onPacienteSeleccionado={setPaciente}
          />
        </div>

        {/* Tratamiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tratamiento Asociado <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tratamientoId}
            onChange={(e) => setTratamientoId(e.target.value)}
            placeholder="ID del tratamiento"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            En producción, esto sería un selector de tratamientos del paciente
          </p>
        </div>

        {/* Laboratorio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Laboratorio <span className="text-red-500">*</span>
          </label>
          <SelectorLaboratorio
            laboratorioSeleccionado={laboratorio}
            onLaboratorioSeleccionado={setLaboratorio}
          />
        </div>

        {/* Tipo de Prótesis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Prótesis <span className="text-red-500">*</span>
          </label>
          <select
            value={tipoProtesis}
            onChange={(e) => setTipoProtesis(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccionar tipo...</option>
            {TIPOS_PROTESIS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material <span className="text-red-500">*</span>
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccionar material...</option>
            {MATERIALES.map((mat) => (
              <option key={mat} value={mat}>
                {mat}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color <span className="text-red-500">*</span>
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccionar color...</option>
            {COLORES.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha Prevista Entrega */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Prevista de Entrega
          </label>
          <input
            type="date"
            value={fechaPrevistaEntrega}
            onChange={(e) => setFechaPrevistaEntrega(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Notas Clínica */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas para Clínica
          </label>
          <textarea
            value={notasClinica}
            onChange={(e) => setNotasClinica(e.target.value)}
            rows={4}
            placeholder="Instrucciones especiales o notas adicionales..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Archivos Adjuntos */}
        {orden?._id && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivos Adjuntos
            </label>
            <UploaderArchivosAdjuntos
              archivos={archivos}
              onSubirArchivos={handleSubirArchivos}
              subiendo={subiendoArchivos}
            />
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onCancelar}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <X className="w-5 h-5" />
          <span>Cancelar</span>
        </button>
        <button
          onClick={handleGuardar}
          disabled={loading || !paciente || !laboratorio || !tipoProtesis || !material || !color}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Guardando...' : 'Guardar Orden'}</span>
        </button>
      </div>
    </div>
  );
}


