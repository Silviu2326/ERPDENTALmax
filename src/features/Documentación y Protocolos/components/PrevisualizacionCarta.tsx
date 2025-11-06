import { Mail, Printer, Download } from 'lucide-react';

interface PrevisualizacionCartaProps {
  asunto: string;
  cuerpoHTML: string;
  nombrePaciente?: string;
  onEnviarEmail?: () => void;
  onImprimir?: () => void;
  onGenerarPDF?: () => void;
}

export default function PrevisualizacionCarta({
  asunto,
  cuerpoHTML,
  nombrePaciente,
  onEnviarEmail,
  onImprimir,
  onGenerarPDF,
}: PrevisualizacionCartaProps) {
  // Procesar el HTML para mostrar los placeholders visibles (en una implementación real, estos se reemplazarían con datos)
  const procesarAsunto = (texto: string): string => {
    // Reemplazar placeholders con valores de ejemplo para previsualización
    return texto
      .replace(/\{\{nombre_paciente\}\}/g, nombrePaciente || 'Juan')
      .replace(/\{\{apellidos_paciente\}\}/g, 'Pérez')
      .replace(/\{\{fecha_proxima_cita\}\}/g, new Date().toLocaleDateString('es-ES'))
      .replace(/\{\{tratamiento_realizado\}\}/g, 'Limpieza dental')
      .replace(/\{\{clinica_nombre\}\}/g, 'Clínica Dental Ejemplo')
      .replace(/\{\{fecha_actual\}\}/g, new Date().toLocaleDateString('es-ES'));
  };

  const procesarCuerpo = (html: string): string => {
    // Reemplazar placeholders en el cuerpo HTML
    return html
      .replace(/\{\{nombre_paciente\}\}/g, nombrePaciente || 'Juan')
      .replace(/\{\{apellidos_paciente\}\}/g, 'Pérez')
      .replace(/\{\{dni_paciente\}\}/g, '12345678A')
      .replace(/\{\{telefono_paciente\}\}/g, '600 123 456')
      .replace(/\{\{email_paciente\}\}/g, 'juan.perez@example.com')
      .replace(/\{\{fecha_proxima_cita\}\}/g, new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
      .replace(/\{\{hora_proxima_cita\}\}/g, '10:00')
      .replace(/\{\{tratamiento_realizado\}\}/g, 'Limpieza dental profesional')
      .replace(/\{\{profesional_nombre\}\}/g, 'Dr. García')
      .replace(/\{\{clinica_nombre\}\}/g, 'Clínica Dental Ejemplo')
      .replace(/\{\{clinica_direccion\}\}/g, 'Calle Principal 123, Madrid')
      .replace(/\{\{clinica_telefono\}\}/g, '91 123 45 67')
      .replace(/\{\{fecha_actual\}\}/g, new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
  };

  if (!asunto && !cuerpoHTML) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="text-center text-gray-500">
          <p className="text-lg">Selecciona una plantilla y un paciente para generar la previsualización</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header con acciones */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Previsualización de la Carta</h3>
          <div className="flex items-center space-x-2">
            {onGenerarPDF && (
              <button
                onClick={onGenerarPDF}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                title="Generar PDF"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            )}
            {onImprimir && (
              <button
                onClick={onImprimir}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                title="Imprimir"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </button>
            )}
            {onEnviarEmail && (
              <button
                onClick={onEnviarEmail}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                title="Enviar por Email"
              >
                <Mail className="w-4 h-4" />
                <span>Enviar Email</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido de la carta */}
      <div className="p-6">
        {/* Asunto */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">Asunto:</p>
          <p className="text-lg font-semibold text-gray-900">{procesarAsunto(asunto)}</p>
        </div>

        {/* Cuerpo */}
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: procesarCuerpo(cuerpoHTML) }}
        />
      </div>
    </div>
  );
}


