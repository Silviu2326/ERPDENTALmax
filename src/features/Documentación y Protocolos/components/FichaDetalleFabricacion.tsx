import { User, Building2, Calendar, FileText, Package, Palette, AlertCircle } from 'lucide-react';
import { OrdenFabricacion, EstadoFabricacion } from '../api/fabricacionApi';

interface FichaDetalleFabricacionProps {
  orden: OrdenFabricacion;
}

const getEstadoBadgeColor = (estado: EstadoFabricacion): string => {
  const colores: Record<EstadoFabricacion, string> = {
    'Pendiente de Aceptación': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Recibido en laboratorio': 'bg-blue-100 text-blue-800 border-blue-300',
    'En Proceso': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'Diseño CAD': 'bg-purple-100 text-purple-800 border-purple-300',
    'Fresado/Impresión': 'bg-pink-100 text-pink-800 border-pink-300',
    'Acabado y Pulido': 'bg-orange-100 text-orange-800 border-orange-300',
    'Control de Calidad': 'bg-cyan-100 text-cyan-800 border-cyan-300',
    'Enviado a clínica': 'bg-teal-100 text-teal-800 border-teal-300',
    'Lista para Entrega': 'bg-green-100 text-green-800 border-green-300',
    'Recibido en Clínica': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Cancelada': 'bg-red-100 text-red-800 border-red-300',
  };
  return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export default function FichaDetalleFabricacion({ orden }: FichaDetalleFabricacionProps) {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 space-y-6">
      {/* Header con Estado */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orden de Fabricación</h2>
          <p className="text-sm text-gray-500 mt-1">ID: {orden._id}</p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold border ${getEstadoBadgeColor(
            orden.estadoActual
          )}`}
        >
          {orden.estadoActual}
        </span>
      </div>

      {/* Información del Paciente */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center space-x-2 mb-3">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Información del Paciente</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nombre Completo</p>
            <p className="text-base font-medium text-gray-900">
              {orden.pacienteId?.nombre} {orden.pacienteId?.apellidos}
            </p>
          </div>
          {orden.pacienteId?.dni && (
            <div>
              <p className="text-sm text-gray-600">DNI</p>
              <p className="text-base font-medium text-gray-900">{orden.pacienteId.dni}</p>
            </div>
          )}
          {orden.pacienteId?.telefono && (
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="text-base font-medium text-gray-900">{orden.pacienteId.telefono}</p>
            </div>
          )}
        </div>
      </div>

      {/* Información del Laboratorio */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center space-x-2 mb-3">
          <Building2 className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Laboratorio</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nombre</p>
            <p className="text-base font-medium text-gray-900">
              {orden.laboratorioId?.nombre}
            </p>
          </div>
          {orden.laboratorioId?.telefono && (
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="text-base font-medium text-gray-900">
                {orden.laboratorioId.telefono}
              </p>
            </div>
          )}
          {orden.laboratorioId?.contacto && (
            <div>
              <p className="text-sm text-gray-600">Contacto</p>
              <p className="text-base font-medium text-gray-900">
                {orden.laboratorioId.contacto}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Especificaciones de Fabricación */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center space-x-2 mb-3">
          <Package className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Especificaciones</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Tipo de Prótesis</p>
            <p className="text-base font-medium text-gray-900">
              {orden.especificaciones?.tipoProtesis || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Material</p>
            <p className="text-base font-medium text-gray-900">
              {orden.especificaciones?.material || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Color</p>
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-400" />
              <p className="text-base font-medium text-gray-900">
                {orden.especificaciones?.color || 'N/A'}
              </p>
            </div>
          </div>
          {orden.tratamientoId && (
            <div>
              <p className="text-sm text-gray-600">Tratamiento</p>
              <p className="text-base font-medium text-gray-900">
                {orden.tratamientoId.nombre}
              </p>
            </div>
          )}
        </div>
        {orden.especificaciones?.notasAdicionales && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-sm text-gray-600 mb-1">Notas Adicionales</p>
            <p className="text-base text-gray-900 whitespace-pre-wrap">
              {orden.especificaciones.notasAdicionales}
            </p>
          </div>
        )}
      </div>

      {/* Fechas */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Fechas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Fecha de Creación</p>
            <p className="text-base font-medium text-gray-900">
              {formatearFecha(orden.fechaCreacion)}
            </p>
          </div>
          {orden.fechaEntregaEstimada && (
            <div>
              <p className="text-sm text-gray-600">Fecha de Entrega Estimada</p>
              <p className="text-base font-medium text-gray-900">
                {formatearFecha(orden.fechaEntregaEstimada)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Archivos Adjuntos */}
      {orden.archivosAdjuntos && orden.archivosAdjuntos.length > 0 && (
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Archivos Adjuntos</h3>
          </div>
          <div className="space-y-2">
            {orden.archivosAdjuntos.map((archivo, index) => (
              <div
                key={archivo._id || index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{archivo.nombre}</p>
                    {archivo.fechaSubida && (
                      <p className="text-xs text-gray-500">
                        Subido: {formatearFecha(archivo.fechaSubida)}
                      </p>
                    )}
                  </div>
                </div>
                {archivo.url && (
                  <a
                    href={archivo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-orange-600 hover:text-orange-700 underline"
                  >
                    Ver
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


