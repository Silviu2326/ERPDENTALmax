import { FileText, Calendar, Package, User, Building2 } from 'lucide-react';

interface OrdenLaboratorio {
  _id: string;
  numeroOrden?: string;
  fechaCreacion?: string;
  fechaEntregaEstimada?: string;
  laboratorio?: {
    _id: string;
    nombre: string;
    contacto?: string;
  };
  tipoProtesis?: string;
  estado?: string;
  observaciones?: string;
}

interface VisorDetallesOrdenLaboratorioProps {
  ordenLaboratorioId: string;
  ordenLaboratorio?: OrdenLaboratorio;
}

export default function VisorDetallesOrdenLaboratorio({
  ordenLaboratorioId,
  ordenLaboratorio,
}: VisorDetallesOrdenLaboratorioProps) {
  // Si no se proporciona la orden, mostrar información básica
  if (!ordenLaboratorio) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 rounded-full p-2">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Orden de Laboratorio</h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">ID:</span> {ordenLaboratorioId}
          </p>
          <p className="text-sm text-gray-500 italic">
            Los detalles completos de la orden se cargarán desde el sistema
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 rounded-full p-2">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Detalles de Orden de Laboratorio</h3>
      </div>

      <div className="space-y-4">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ordenLaboratorio.numeroOrden && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Número de Orden</p>
              <p className="text-gray-900 font-semibold">{ordenLaboratorio.numeroOrden}</p>
            </div>
          )}

          {ordenLaboratorio.tipoProtesis && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Tipo de Prótesis</p>
              <p className="text-gray-900">{ordenLaboratorio.tipoProtesis}</p>
            </div>
          )}

          {ordenLaboratorio.estado && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Estado</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                ordenLaboratorio.estado === 'Completada'
                  ? 'bg-green-100 text-green-800'
                  : ordenLaboratorio.estado === 'En Proceso'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {ordenLaboratorio.estado}
              </span>
            </div>
          )}
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          {ordenLaboratorio.fechaCreacion && (
            <div className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Fecha de Creación</p>
                <p className="text-gray-900">
                  {new Date(ordenLaboratorio.fechaCreacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}

          {ordenLaboratorio.fechaEntregaEstimada && (
            <div className="flex items-start gap-2">
              <Package className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">Fecha Estimada de Entrega</p>
                <p className="text-gray-900">
                  {new Date(ordenLaboratorio.fechaEntregaEstimada).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Laboratorio */}
        {ordenLaboratorio.laboratorio && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Laboratorio</p>
                <p className="text-gray-900 font-semibold">{ordenLaboratorio.laboratorio.nombre}</p>
                {ordenLaboratorio.laboratorio.contacto && (
                  <p className="text-sm text-gray-600 mt-1">{ordenLaboratorio.laboratorio.contacto}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Observaciones */}
        {ordenLaboratorio.observaciones && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Observaciones</p>
            <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">
              {ordenLaboratorio.observaciones}
            </p>
          </div>
        )}

        {/* ID de referencia */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            <span className="font-medium">ID de Referencia:</span> {ordenLaboratorioId}
          </p>
        </div>
      </div>
    </div>
  );
}


