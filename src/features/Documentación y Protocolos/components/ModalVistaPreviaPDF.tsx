import { useState } from 'react';
import { X, Download, Printer, FileText, Calendar, User, Pill, Building2 } from 'lucide-react';
import { Receta, generarPDFReceta } from '../api/recetasApi';

interface ModalVistaPreviaPDFProps {
  receta: Receta;
  onCerrar: () => void;
}

export default function ModalVistaPreviaPDF({ receta, onCerrar }: ModalVistaPreviaPDFProps) {
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDescargarPDF = async () => {
    if (!receta._id) {
      alert('No se puede generar el PDF: la receta no tiene ID');
      return;
    }

    setGenerandoPDF(true);
    try {
      const blob = await generarPDFReceta(receta._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receta-${receta.folio}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setGenerandoPDF(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Vista Previa de Receta</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDescargarPDF}
              disabled={generandoPDF}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Descargar PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleImprimir}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              title="Imprimir"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onCerrar}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
            {/* Encabezado de la Receta */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  {receta.clinica.nombre}
                </h1>
              </div>
              <p className="text-sm text-gray-600">Receta Médica</p>
              <p className="text-xs text-gray-500 mt-2">Folio: {receta.folio}</p>
            </div>

            {/* Información del Paciente */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Datos del Paciente</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="font-medium text-gray-900">
                      {receta.paciente.nombre} {receta.paciente.apellidos}
                    </p>
                  </div>
                  {receta.paciente.dni && (
                    <div>
                      <p className="text-sm text-gray-500">DNI</p>
                      <p className="font-medium text-gray-900">{receta.paciente.dni}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Información del Odontólogo */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Prescrito por</span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  Dr./Dra. {receta.odontologo.nombre} {receta.odontologo.apellidos}
                </p>
              </div>
            </div>

            {/* Medicamentos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <span>Medicamentos Prescritos</span>
              </h3>
              <div className="space-y-4">
                {receta.medicamentos.map((medicamento, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600"
                  >
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">
                      {index + 1}. {medicamento.nombre}
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Dosis</p>
                        <p className="font-medium text-gray-900">{medicamento.dosis}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Frecuencia</p>
                        <p className="font-medium text-gray-900">{medicamento.frecuencia}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duración</p>
                        <p className="font-medium text-gray-900">{medicamento.duracion}</p>
                      </div>
                    </div>
                    {medicamento.indicaciones_especificas && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-sm text-gray-500">Indicaciones específicas</p>
                        <p className="text-gray-700">{medicamento.indicaciones_especificas}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Indicaciones Generales */}
            {receta.indicaciones_generales && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Indicaciones Generales
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {receta.indicaciones_generales}
                  </p>
                </div>
              </div>
            )}

            {/* Fecha y Estado */}
            <div className="mt-8 pt-6 border-t-2 border-gray-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">{formatearFecha(receta.fecha)}</span>
                </div>
                {receta.estado === 'Anulada' && (
                  <span className="px-4 py-2 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
                    Receta Anulada
                  </span>
                )}
              </div>
            </div>

            {/* Nota legal */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center italic">
                Esta receta es válida únicamente con la firma y sello del profesional prescriptor.
                Conserve este documento para su seguimiento médico.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onCerrar}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleDescargarPDF}
              disabled={generandoPDF}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {generandoPDF ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Descargar PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



