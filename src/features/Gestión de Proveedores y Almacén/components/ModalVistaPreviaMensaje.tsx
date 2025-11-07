import { X, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { RecordatorioPlantilla } from '../api/recordatoriosApi';

interface ModalVistaPreviaMensajeProps {
  plantilla: RecordatorioPlantilla;
  datosEjemplo?: {
    nombre_paciente?: string;
    apellidos_paciente?: string;
    fecha_cita?: string;
    hora_cita?: string;
    tratamiento?: string;
    profesional?: string;
    sede?: string;
  };
  onCerrar: () => void;
}

export default function ModalVistaPreviaMensaje({
  plantilla,
  datosEjemplo,
  onCerrar,
}: ModalVistaPreviaMensajeProps) {
  // Datos de ejemplo por defecto
  const datos = {
    nombre_paciente: datosEjemplo?.nombre_paciente || 'Juan',
    apellidos_paciente: datosEjemplo?.apellidos_paciente || 'Pérez',
    fecha_cita: datosEjemplo?.fecha_cita || '15/03/2024',
    hora_cita: datosEjemplo?.hora_cita || '10:00',
    tratamiento: datosEjemplo?.tratamiento || 'Limpieza dental',
    profesional: datosEjemplo?.profesional || 'Dr. García',
    sede: datosEjemplo?.sede || 'Sede Central',
  };

  // Reemplazar variables en el cuerpo del mensaje
  const procesarTexto = (texto: string) => {
    let textoProcesado = texto;
    textoProcesado = textoProcesado.replace(/{{nombre_paciente}}/g, datos.nombre_paciente);
    textoProcesado = textoProcesado.replace(/{{apellidos_paciente}}/g, datos.apellidos_paciente);
    textoProcesado = textoProcesado.replace(/{{fecha_cita}}/g, datos.fecha_cita);
    textoProcesado = textoProcesado.replace(/{{hora_cita}}/g, datos.hora_cita);
    textoProcesado = textoProcesado.replace(/{{tratamiento}}/g, datos.tratamiento);
    textoProcesado = textoProcesado.replace(/{{profesional}}/g, datos.profesional);
    textoProcesado = textoProcesado.replace(/{{sede}}/g, datos.sede);
    return textoProcesado;
  };

  const cuerpoProcesado = procesarTexto(plantilla.cuerpo);
  const asuntoProcesado = plantilla.asunto ? procesarTexto(plantilla.asunto) : null;

  const getTipoIcon = () => {
    switch (plantilla.tipo) {
      case 'SMS':
        return <Smartphone className="w-5 h-5" />;
      case 'Email':
        return <Mail className="w-5 h-5" />;
      case 'WhatsApp':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTipoColor = () => {
    switch (plantilla.tipo) {
      case 'SMS':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Email':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'WhatsApp':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ring-1 ${getTipoColor()}`}>{getTipoIcon()}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Vista Previa del Mensaje</h3>
              <p className="text-sm text-gray-600">{plantilla.nombre}</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Simulación del mensaje según el tipo */}
          {plantilla.tipo === 'SMS' && (
            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
              <div className="bg-white rounded-xl shadow-sm p-4 ring-1 ring-slate-200">
                <div className="text-sm text-slate-600 mb-2">De: Clínica Dental</div>
                {asuntoProcesado && (
                  <div className="text-sm font-semibold text-gray-900 mb-2">{asuntoProcesado}</div>
                )}
                <div className="text-sm text-gray-900 whitespace-pre-wrap">{cuerpoProcesado}</div>
                <div className="text-xs text-slate-500 mt-4 text-right">
                  {cuerpoProcesado.length} caracteres
                </div>
              </div>
            </div>
          )}

          {plantilla.tipo === 'Email' && (
            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
              <div className="bg-white rounded-xl shadow-sm p-6 ring-1 ring-slate-200">
                <div className="mb-4">
                  <div className="text-xs text-slate-600 mb-1">De: Clínica Dental</div>
                  <div className="text-xs text-slate-600 mb-1">Para: {datos.nombre_paciente} {datos.apellidos_paciente}</div>
                  {asuntoProcesado && (
                    <div className="text-sm font-semibold text-gray-900 mt-2">
                      Asunto: {asuntoProcesado}
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-900 whitespace-pre-wrap">{cuerpoProcesado}</div>
                </div>
              </div>
            </div>
          )}

          {plantilla.tipo === 'WhatsApp' && (
            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
              <div className="bg-[#dcf8c6] rounded-xl shadow-sm p-4 ring-1 ring-slate-200 max-w-[80%] ml-auto">
                <div className="text-sm text-gray-900 whitespace-pre-wrap">{cuerpoProcesado}</div>
                <div className="text-xs text-slate-500 mt-2 text-right">
                  {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )}

          {/* Información de la plantilla */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Información de la Plantilla</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-600">Tipo:</span>
                <span className="ml-2 font-medium text-gray-900">{plantilla.tipo}</span>
              </div>
              <div>
                <span className="text-slate-600">Estado:</span>
                <span className={`ml-2 font-medium ${plantilla.activo ? 'text-green-600' : 'text-slate-600'}`}>
                  {plantilla.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div className="col-span-1 md:col-span-2">
                <span className="text-slate-600">Variables utilizadas:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {plantilla.variables && plantilla.variables.length > 0 ? (
                    plantilla.variables.map((variable, index) => (
                      <code
                        key={index}
                        className="px-2 py-1 bg-white rounded-lg ring-1 ring-slate-200 text-xs font-mono text-slate-700"
                      >
                        {variable}
                      </code>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs">Ninguna</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200/60">
          <button
            onClick={onCerrar}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}



