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
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-6">
        {/* Paciente */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Paciente <span className="text-red-500">*</span>
          </label>
          <BuscadorPacientes
            pacienteSeleccionado={paciente}
            onPacienteSeleccionado={setPaciente}
          />
        </div>

        {/* Tratamiento */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tratamiento Asociado <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tratamientoId}
            onChange={(e) => setTratamientoId(e.target.value)}
            placeholder="ID del tratamiento"
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            En producción, esto sería un selector de tratamientos del paciente
          </p>
        </div>

        {/* Laboratorio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Laboratorio <span className="text-red-500">*</span>
          </label>
          <SelectorLaboratorio
            laboratorioSeleccionado={laboratorio}
            onLaboratorioSeleccionado={setLaboratorio}
          />
        </div>

        {/* Tipo de Prótesis */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Prótesis <span className="text-red-500">*</span>
          </label>
          <select
            value={tipoProtesis}
            onChange={(e) => setTipoProtesis(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Material <span className="text-red-500">*</span>
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Color <span className="text-red-500">*</span>
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Fecha Prevista de Entrega
          </label>
          <input
            type="date"
            value={fechaPrevistaEntrega}
            onChange={(e) => setFechaPrevistaEntrega(e.target.value)}
            className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>

        {/* Notas Clínica */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notas para Clínica
          </label>
          <textarea
            value={notasClinica}
            onChange={(e) => setNotasClinica(e.target.value)}
            rows={4}
            placeholder="Instrucciones especiales o notas adicionales..."
            className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
          />
        </div>

        {/* Archivos Adjuntos */}
        {orden?._id && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
      <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-gray-100">
        <button
          onClick={onCancelar}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50 ring-1 ring-slate-300"
        >
          <X size={20} />
          <span>Cancelar</span>
        </button>
        <button
          onClick={handleGuardar}
          disabled={loading || !paciente || !laboratorio || !tipoProtesis || !material || !color}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Save size={20} />
          <span>{loading ? 'Guardando...' : 'Guardar Orden'}</span>
        </button>
      </div>
    </div>
  );
}



