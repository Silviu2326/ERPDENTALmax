import { Edit, Trash2, Eye, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { DocumentoPlantilla } from '../api/plantillasApi';

interface TablaPlantillasDocumentosProps {
  plantillas: DocumentoPlantilla[];
  onEditar: (plantilla: DocumentoPlantilla) => void;
  onEliminar: (plantilla: DocumentoPlantilla) => void;
  onVer: (plantilla: DocumentoPlantilla) => void;
  loading?: boolean;
}

const tipoLabels: Record<DocumentoPlantilla['tipo'], string> = {
  consentimiento: 'Consentimiento',
  prescripcion: 'Prescripción',
  informe: 'Informe',
  justificante: 'Justificante',
  presupuesto: 'Presupuesto',
  otro: 'Otro',
};

export default function TablaPlantillasDocumentos({
  plantillas,
  onEditar,
  onEliminar,
  onVer,
  loading = false,
}: TablaPlantillasDocumentosProps) {
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200">
        <div className="p-8 text-center">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando plantillas...</p>
        </div>
      </div>
    );
  }

  if (plantillas.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200">
        <div className="p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay plantillas disponibles</h3>
          <p className="text-gray-600">No se encontraron plantillas que coincidan con los filtros aplicados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-2xl ring-1 ring-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Versión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Sede
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plantillas.map((plantilla) => (
              <tr key={plantilla._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{plantilla.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ring-1 ring-blue-200/50">
                    {tipoLabels[plantilla.tipo]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  v{plantilla.version}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plantilla.activa ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ring-1 ring-green-200/50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ring-1 ring-red-200/50">
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {plantilla.sedeId ? 'Específica' : 'Global'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onVer(plantilla)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-xl hover:bg-blue-50 transition-all"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditar(plantilla)}
                      className="text-indigo-600 hover:text-indigo-900 p-2 rounded-xl hover:bg-indigo-50 transition-all"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEliminar(plantilla)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-xl hover:bg-red-50 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



