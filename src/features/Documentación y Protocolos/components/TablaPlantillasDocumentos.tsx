import { useState } from 'react';
import { Edit, Trash2, Eye, FileText, CheckCircle, XCircle } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando plantillas...</p>
        </div>
      </div>
    );
  }

  if (plantillas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay plantillas disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Versión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Sede
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
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
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {tipoLabels[plantilla.tipo]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  v{plantilla.version}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {plantilla.activa ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {plantilla.sedeId ? 'Específica' : 'Global'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onVer(plantilla)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditar(plantilla)}
                      className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEliminar(plantilla)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
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


