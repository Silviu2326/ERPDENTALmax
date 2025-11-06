import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import BuscadorPacientes from './BuscadorPacientes';
import SelectorLaboratorio from './SelectorLaboratorio';
import UploaderArchivosAdjuntos from './UploaderArchivosAdjuntos';
import {
  NuevaOrdenLaboratorio,
  OrdenLaboratorio,
  EstadoOrden,
  subirArchivosAdjuntos,
  eliminarArchivoAdjunto,
} from '../api/ordenesLaboratorioApi';

interface Paciente {
  _id: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  email?: string;
  dni?: string;
}

interface FormularioOrdenLaboratorioProps {
  orden?: OrdenLaboratorio;
  onGuardar: (orden: NuevaOrdenLaboratorio) => Promise<void>;
  onCancelar: () => void;
  loading?: boolean;
}

const ESTADOS: EstadoOrden[] = [
  'Borrador',
  'Enviada',
  'Recibida',
  'En Proceso',
  'Control Calidad',
  'Enviada a Clínica',
  'Recibida en Clínica',
  'Completada',
];

export default function FormularioOrdenLaboratorio({
  orden,
  onGuardar,
  onCancelar,
  loading = false,
}: FormularioOrdenLaboratorioProps) {
  const { user } = useAuth();
  const [paciente, setPaciente] = useState<Paciente | null>(
    orden?.paciente ? {
      _id: orden.paciente._id,
      nombre: orden.paciente.nombre,
      apellidos: orden.paciente.apellidos,
      dni: orden.paciente.dni,
    } : null
  );
  const [laboratorio, setLaboratorio] = useState<any>(orden?.laboratorio || null);
  const [tipoTrabajo, setTipoTrabajo] = useState(orden?.tipoTrabajo || '');
  const [materiales, setMateriales] = useState(orden?.materiales || '');
  const [color, setColor] = useState(orden?.color || '');
  const [instrucciones, setInstrucciones] = useState(orden?.instrucciones || '');
  const [fechaEntregaPrevista, setFechaEntregaPrevista] = useState(
    orden?.fechaEntregaPrevista
      ? new Date(orden.fechaEntregaPrevista).toISOString().split('T')[0]
      : ''
  );
  const [estado, setEstado] = useState<EstadoOrden>(orden?.estado || 'Borrador');
  const [archivos, setArchivos] = useState(orden?.adjuntos || []);
  const [subiendoArchivos, setSubiendoArchivos] = useState(false);

  const handleGuardar = async () => {
    if (!paciente || !laboratorio || !tipoTrabajo) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (!user?._id) {
      alert('Error: No se pudo identificar al usuario');
      return;
    }

    const nuevaOrden: NuevaOrdenLaboratorio = {
      pacienteId: paciente._id,
      laboratorioId: laboratorio._id,
      odontologoId: user._id,
      tipoTrabajo,
      materiales: materiales || undefined,
      color: color || undefined,
      instrucciones: instrucciones || undefined,
      fechaEntregaPrevista: fechaEntregaPrevista || undefined,
      estado,
    };

    if (orden?._id && orden.tratamientoAsociado) {
      nuevaOrden.tratamientoAsociadoId = orden.tratamientoAsociado._id;
    }

    try {
      await onGuardar(nuevaOrden);
    } catch (error) {
      console.error('Error al guardar la orden:', error);
      alert('Error al guardar la orden. Por favor, inténtelo de nuevo.');
    }
  };

  const handleSubirArchivos = async (files: File[]) => {
    if (!orden?._id) {
      alert('Debe guardar la orden primero antes de subir archivos');
      return;
    }

    setSubiendoArchivos(true);
    try {
      const nuevosArchivos = await subirArchivosAdjuntos(orden._id, files);
      setArchivos([...archivos, ...nuevosArchivos]);
    } catch (error) {
      console.error('Error al subir archivos:', error);
      alert('Error al subir los archivos');
    } finally {
      setSubiendoArchivos(false);
    }
  };

  const handleEliminarArchivo = async (archivoId: string) => {
    if (!orden?._id) return;

    try {
      await eliminarArchivoAdjunto(orden._id, archivoId);
      setArchivos(archivos.filter((a) => a._id !== archivoId));
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
      alert('Error al eliminar el archivo');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {orden ? 'Editar Orden de Laboratorio' : 'Nueva Orden de Laboratorio'}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Selección de Paciente */}
        <div>
          <BuscadorPacientes
            pacienteSeleccionado={paciente}
            onPacienteSeleccionado={setPaciente}
          />
        </div>

        {/* Selección de Laboratorio */}
        <div>
          <SelectorLaboratorio
            laboratorioSeleccionado={laboratorio}
            onLaboratorioSeleccionado={setLaboratorio}
          />
        </div>

        {/* Tipo de Trabajo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Trabajo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={tipoTrabajo}
            onChange={(e) => setTipoTrabajo(e.target.value)}
            placeholder="Ej: Corona, Prótesis fija, Prótesis removible..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Materiales y Color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materiales
            </label>
            <input
              type="text"
              value={materiales}
              onChange={(e) => setMateriales(e.target.value)}
              placeholder="Ej: Zirconio, Cerámica, Resina..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ej: A2, B1, Natural..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Instrucciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instrucciones
          </label>
          <textarea
            value={instrucciones}
            onChange={(e) => setInstrucciones(e.target.value)}
            rows={4}
            placeholder="Instrucciones detalladas para el laboratorio..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Fecha Entrega Prevista y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Entrega Prevista
            </label>
            <input
              type="date"
              value={fechaEntregaPrevista}
              onChange={(e) => setFechaEntregaPrevista(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoOrden)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {ESTADOS.map((est) => (
                <option key={est} value={est}>
                  {est}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Archivos Adjuntos */}
        {orden?._id && (
          <div>
            <UploaderArchivosAdjuntos
              archivos={archivos}
              onArchivosSubidos={handleSubirArchivos}
              onEliminarArchivo={handleEliminarArchivo}
              disabled={subiendoArchivos}
            />
          </div>
        )}

        {/* Botones de Acción */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            disabled={loading || !paciente || !laboratorio || !tipoTrabajo}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


