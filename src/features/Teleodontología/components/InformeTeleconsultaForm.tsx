import { useState, useEffect } from 'react';
import { Save, Paperclip, AlertCircle } from 'lucide-react';
import SeccionDiagnosticoPresuntivo from './SeccionDiagnosticoPresuntivo';
import SeccionPlanRecomendado from './SeccionPlanRecomendado';
import ModalAdjuntarArchivosTeleconsulta from './ModalAdjuntarArchivosTeleconsulta';
import FirmaDigitalOdontologo from './FirmaDigitalOdontologo';
import {
  CrearInformeData,
  ActualizarInformeData,
  ArchivoAdjunto,
  Prescripcion,
  InformeTeleconsulta,
} from '../api/informeTeleconsultaApi';
import { subirArchivosInforme, eliminarArchivoAdjunto } from '../api/informeTeleconsultaApi';

interface InformeTeleconsultaFormProps {
  informeInicial?: InformeTeleconsulta;
  teleconsultaId: string;
  nombreOdontologo?: string;
  onGuardar: (datos: CrearInformeData | ActualizarInformeData) => Promise<void>;
  onGuardarBorrador: (datos: CrearInformeData | ActualizarInformeData) => Promise<void>;
  esEdicion?: boolean;
}

export default function InformeTeleconsultaForm({
  informeInicial,
  teleconsultaId,
  nombreOdontologo,
  onGuardar,
  onGuardarBorrador,
  esEdicion = false,
}: InformeTeleconsultaFormProps) {
  const [diagnosticoPresuntivo, setDiagnosticoPresuntivo] = useState(
    informeInicial?.diagnosticoPresuntivo || ''
  );
  const [observaciones, setObservaciones] = useState(informeInicial?.observaciones || '');
  const [planTratamientoRecomendado, setPlanTratamientoRecomendado] = useState(
    informeInicial?.planTratamientoRecomendado || ''
  );
  const [prescripciones, setPrescripciones] = useState<Prescripcion[]>(
    informeInicial?.prescripciones || []
  );
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<ArchivoAdjunto[]>(
    informeInicial?.archivosAdjuntos || []
  );
  const [firmaDigital, setFirmaDigital] = useState(informeInicial?.firmaDigital || '');
  const [mostrarModalArchivos, setMostrarModalArchivos] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardandoBorrador, setGuardandoBorrador] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Auto-guardado de borrador cada 30 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (diagnosticoPresuntivo || observaciones || planTratamientoRecomendado) {
        guardarBorradorAutomatico();
      }
    }, 30000); // 30 segundos

    return () => clearInterval(intervalo);
  }, [diagnosticoPresuntivo, observaciones, planTratamientoRecomendado]);

  const guardarBorradorAutomatico = async () => {
    try {
      const datos: CrearInformeData | ActualizarInformeData = {
        diagnosticoPresuntivo,
        observaciones,
        planTratamientoRecomendado,
        prescripciones,
        esBorrador: true,
      };

      if (esEdicion) {
        await onGuardarBorrador(datos);
      } else {
        await onGuardarBorrador(datos);
      }
    } catch (err) {
      // Silenciar errores de auto-guardado
      console.warn('Error en auto-guardado:', err);
    }
  };

  const handleGuardar = async (esFinal: boolean) => {
    setError(null);
    setMensajeExito(null);

    // Validaciones
    if (esFinal && !firmaDigital) {
      setError('Debe firmar digitalmente el informe antes de finalizarlo');
      return;
    }

    if (esFinal && !diagnosticoPresuntivo.trim()) {
      setError('El diagnóstico presuntivo es obligatorio');
      return;
    }

    try {
      if (esFinal) {
        setGuardando(true);
      } else {
        setGuardandoBorrador(true);
      }

      const datos: CrearInformeData | ActualizarInformeData = {
        diagnosticoPresuntivo,
        observaciones,
        planTratamientoRecomendado,
        prescripciones,
        firmaDigital: esFinal ? firmaDigital : undefined,
        esBorrador: !esFinal,
      };

      await onGuardar(datos);

      if (esFinal) {
        setMensajeExito('Informe guardado y finalizado correctamente');
      } else {
        setMensajeExito('Borrador guardado correctamente');
      }

      setTimeout(() => {
        setMensajeExito(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar el informe');
    } finally {
      setGuardando(false);
      setGuardandoBorrador(false);
    }
  };

  const handleSubirArchivos = async (files: File[]): Promise<ArchivoAdjunto[]> => {
    const archivosSubidos = await subirArchivosInforme(teleconsultaId, files);
    setArchivosAdjuntos((prev) => [...prev, ...archivosSubidos]);
    return archivosSubidos;
  };

  const handleEliminarArchivo = async (archivoId: string) => {
    try {
      await eliminarArchivoAdjunto(teleconsultaId, archivoId);
      setArchivosAdjuntos((prev) => prev.filter((a) => a._id !== archivoId));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar archivo');
    }
  };

  const agregarPrescripcion = () => {
    setPrescripciones([
      ...prescripciones,
      {
        medicamento: '',
        dosis: '',
        frecuencia: '',
        duracion: '',
        instrucciones: '',
      },
    ]);
  };

  const eliminarPrescripcion = (index: number) => {
    setPrescripciones(prescripciones.filter((_, i) => i !== index));
  };

  const actualizarPrescripcion = (index: number, campo: keyof Prescripcion, valor: string) => {
    const nuevasPrescripciones = [...prescripciones];
    nuevasPrescripciones[index] = {
      ...nuevasPrescripciones[index],
      [campo]: valor,
    };
    setPrescripciones(nuevasPrescripciones);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informe de Teleconsulta</h2>
        <p className="text-gray-600">
          Complete el informe para documentar los hallazgos, diagnóstico y recomendaciones de la teleconsulta
        </p>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {mensajeExito && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {mensajeExito}
        </div>
      )}

      {/* Observaciones */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-3">Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Detalle las observaciones realizadas durante la teleconsulta..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-2 text-sm text-gray-500">
          Describa los hallazgos y observaciones clínicas durante la consulta a distancia
        </p>
      </div>

      {/* Diagnóstico Presuntivo */}
      <SeccionDiagnosticoPresuntivo
        value={diagnosticoPresuntivo}
        onChange={setDiagnosticoPresuntivo}
        error={error && !diagnosticoPresuntivo.trim() ? 'Campo obligatorio' : undefined}
      />

      {/* Plan de Tratamiento Recomendado */}
      <SeccionPlanRecomendado
        value={planTratamientoRecomendado}
        onChange={setPlanTratamientoRecomendado}
      />

      {/* Prescripciones */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-lg font-semibold text-gray-900">Prescripciones</label>
          <button
            onClick={agregarPrescripcion}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            + Agregar Prescripción
          </button>
        </div>

        {prescripciones.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No hay prescripciones agregadas</p>
        ) : (
          <div className="space-y-4">
            {prescripciones.map((prescripcion, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Prescripción {index + 1}
                  </span>
                  <button
                    onClick={() => eliminarPrescripcion(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medicamento *
                    </label>
                    <input
                      type="text"
                      value={prescripcion.medicamento}
                      onChange={(e) => actualizarPrescripcion(index, 'medicamento', e.target.value)}
                      placeholder="Nombre del medicamento"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosis</label>
                    <input
                      type="text"
                      value={prescripcion.dosis || ''}
                      onChange={(e) => actualizarPrescripcion(index, 'dosis', e.target.value)}
                      placeholder="Ej: 500mg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
                    <input
                      type="text"
                      value={prescripcion.frecuencia || ''}
                      onChange={(e) => actualizarPrescripcion(index, 'frecuencia', e.target.value)}
                      placeholder="Ej: Cada 8 horas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                    <input
                      type="text"
                      value={prescripcion.duracion || ''}
                      onChange={(e) => actualizarPrescripcion(index, 'duracion', e.target.value)}
                      placeholder="Ej: 7 días"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instrucciones</label>
                  <textarea
                    value={prescripcion.instrucciones || ''}
                    onChange={(e) => actualizarPrescripcion(index, 'instrucciones', e.target.value)}
                    placeholder="Instrucciones adicionales para el paciente"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archivos Adjuntos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-lg font-semibold text-gray-900">Archivos Adjuntos</label>
          <button
            onClick={() => setMostrarModalArchivos(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Paperclip className="w-4 h-4" />
            <span>Adjuntar Archivos</span>
          </button>
        </div>
        {archivosAdjuntos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {archivosAdjuntos.map((archivo) => (
              <div
                key={archivo._id || archivo.url}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-900 truncate">{archivo.nombre}</p>
                <a
                  href={archivo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 block"
                >
                  Ver archivo
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No hay archivos adjuntos</p>
        )}
      </div>

      {/* Firma Digital */}
      <FirmaDigitalOdontologo
        onFirmaCompleta={setFirmaDigital}
        firmaActual={firmaDigital}
        nombreOdontologo={nombreOdontologo}
      />

      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={() => handleGuardar(false)}
          disabled={guardandoBorrador}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {guardandoBorrador ? 'Guardando...' : 'Guardar Borrador'}
        </button>
        <button
          onClick={() => handleGuardar(true)}
          disabled={guardando || !firmaDigital}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          <span>{guardando ? 'Finalizando...' : 'Finalizar y Guardar Informe'}</span>
        </button>
      </div>

      {/* Modal de archivos */}
      <ModalAdjuntarArchivosTeleconsulta
        isOpen={mostrarModalArchivos}
        onClose={() => setMostrarModalArchivos(false)}
        archivosActuales={archivosAdjuntos}
        onArchivosSubidos={(archivos) => setArchivosAdjuntos([...archivosAdjuntos, ...archivos])}
        onEliminarArchivo={handleEliminarArchivo}
        onSubirArchivos={handleSubirArchivos}
      />
    </div>
  );
}


