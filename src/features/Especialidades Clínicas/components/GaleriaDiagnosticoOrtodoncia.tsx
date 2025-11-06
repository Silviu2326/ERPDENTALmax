import { useState } from 'react';
import { Image, File3D, Download, Trash2, Edit2, Eye } from 'lucide-react';
import { OrtodonciaDiagnostico, ArchivoDiagnostico } from '../api/ortodonciaDiagnosticoApi';
import VisorImagenDentalAvanzado from './VisorImagenDentalAvanzado';

interface GaleriaDiagnosticoOrtodonciaProps {
  diagnostico: OrtodonciaDiagnostico;
  onEliminarArchivo?: (archivoId: string) => void;
  onEditarArchivo?: (archivoId: string, metadata: { tipo?: string; subtipo?: string }) => void;
}

export default function GaleriaDiagnosticoOrtodoncia({
  diagnostico,
  onEliminarArchivo,
  onEditarArchivo,
}: GaleriaDiagnosticoOrtodonciaProps) {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<ArchivoDiagnostico | null>(null);
  const [archivoEditando, setArchivoEditando] = useState<string | null>(null);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [nuevoSubtipo, setNuevoSubtipo] = useState('');

  const tiposArchivo = [
    'Foto Intraoral',
    'Foto Extraoral',
    'Radiografía',
    'Modelo 3D',
  ];

  const subtiposPorTipo: Record<string, string[]> = {
    'Foto Intraoral': ['Oclusal Superior', 'Oclusal Inferior', 'Frontal', 'Vista Lateral Derecha', 'Vista Lateral Izquierda'],
    'Foto Extraoral': ['Frontal', 'Perfil Derecho', 'Perfil Izquierdo', 'Sonrisa', 'Oclusión'],
    'Radiografía': ['Cefalométrica', 'Panorámica', 'Periapical', 'Oclusal'],
    'Modelo 3D': ['STL', 'OBJ', 'PLY'],
  };

  const getIconoArchivo = (tipo: string) => {
    if (tipo.includes('Foto') || tipo.includes('Radiografía')) {
      return <Image className="w-5 h-5" />;
    }
    if (tipo.includes('3D')) {
      return <File3D className="w-5 h-5" />;
    }
    return <Image className="w-5 h-5" />;
  };

  const handleDescargar = (archivo: ArchivoDiagnostico) => {
    const link = document.createElement('a');
    link.href = archivo.url;
    link.download = archivo.nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIniciarEdicion = (archivo: ArchivoDiagnostico) => {
    setArchivoEditando(archivo._id || null);
    setNuevoTipo(archivo.tipo);
    setNuevoSubtipo(archivo.subtipo || '');
  };

  const handleGuardarEdicion = (archivoId: string) => {
    if (onEditarArchivo) {
      onEditarArchivo(archivoId, {
        tipo: nuevoTipo,
        subtipo: nuevoSubtipo,
      });
    }
    setArchivoEditando(null);
    setNuevoTipo('');
    setNuevoSubtipo('');
  };

  const handleCancelarEdicion = () => {
    setArchivoEditando(null);
    setNuevoTipo('');
    setNuevoSubtipo('');
  };

  if (diagnostico.archivos.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay archivos en este diagnóstico</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {diagnostico.archivos.map((archivo) => (
          <div
            key={archivo._id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Vista previa */}
            <div
              className="aspect-square bg-gray-100 flex items-center justify-center cursor-pointer relative overflow-hidden"
              onClick={() => {
                if (!archivo.tipo.includes('3D')) {
                  setArchivoSeleccionado(archivo);
                }
              }}
            >
              {archivo.tipo.includes('3D') ? (
                <div className="text-center p-4">
                  <File3D className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">{archivo.subtipo || archivo.tipo}</p>
                </div>
              ) : (
                <img
                  src={archivo.url}
                  alt={archivo.nombreArchivo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
              
              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!archivo.tipo.includes('3D')) {
                      setArchivoSeleccionado(archivo);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded text-blue-600 hover:bg-blue-50 transition-opacity"
                  title="Ver"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDescargar(archivo);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded text-green-600 hover:bg-green-50 transition-opacity"
                  title="Descargar"
                >
                  <Download className="w-4 h-4" />
                </button>
                {onEliminarArchivo && archivo._id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('¿Está seguro de eliminar este archivo?')) {
                        onEliminarArchivo(archivo._id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded text-red-600 hover:bg-red-50 transition-opacity"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Información del archivo */}
            <div className="p-3">
              {archivoEditando === archivo._id ? (
                <div className="space-y-2">
                  <select
                    value={nuevoTipo}
                    onChange={(e) => {
                      setNuevoTipo(e.target.value);
                      setNuevoSubtipo(subtiposPorTipo[e.target.value]?.[0] || '');
                    }}
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                  >
                    {tiposArchivo.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                  <select
                    value={nuevoSubtipo}
                    onChange={(e) => setNuevoSubtipo(e.target.value)}
                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                  >
                    {subtiposPorTipo[nuevoTipo]?.map((subtipo) => (
                      <option key={subtipo} value={subtipo}>
                        {subtipo}
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleGuardarEdicion(archivo._id!)}
                      className="flex-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelarEdicion}
                      className="flex-1 text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2 mb-1">
                    {getIconoArchivo(archivo.tipo)}
                    <p className="text-xs font-medium text-gray-800 truncate flex-1">
                      {archivo.nombreArchivo}
                    </p>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <div>{archivo.tipo}</div>
                    {archivo.subtipo && <div className="text-gray-500">{archivo.subtipo}</div>}
                  </div>
                  {onEditarArchivo && archivo._id && (
                    <button
                      onClick={() => handleIniciarEdicion(archivo)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Visor de imagen avanzado */}
      {archivoSeleccionado && (
        <VisorImagenDentalAvanzado
          imagenUrl={archivoSeleccionado.url}
          nombreArchivo={archivoSeleccionado.nombreArchivo}
          onCerrar={() => setArchivoSeleccionado(null)}
        />
      )}
    </>
  );
}


