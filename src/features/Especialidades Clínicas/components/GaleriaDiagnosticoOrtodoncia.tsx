import { useState } from 'react';
import { Image, Layers, Download, Trash2, Edit2, Eye } from 'lucide-react';
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
      return <Layers className="w-5 h-5" />;
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
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Image size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay archivos</h3>
        <p className="text-gray-600">No hay archivos en este diagnóstico</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {diagnostico.archivos.map((archivo) => (
          <div
            key={archivo._id}
            className="bg-white rounded-lg shadow-sm ring-1 ring-slate-200 overflow-hidden hover:shadow-md transition-shadow group h-full flex flex-col"
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
                  <Layers size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600">{archivo.subtipo || archivo.tipo}</p>
                </div>
              ) : (
                <img
                  src={archivo.url}
                  alt={archivo.nombreArchivo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
              
              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!archivo.tipo.includes('3D')) {
                      setArchivoSeleccionado(archivo);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50 transition-opacity"
                  title="Ver"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDescargar(archivo);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg text-green-600 hover:bg-green-50 transition-opacity"
                  title="Descargar"
                >
                  <Download size={16} />
                </button>
                {onEliminarArchivo && archivo._id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('¿Está seguro de eliminar este archivo?')) {
                        onEliminarArchivo(archivo._id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-opacity"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Información del archivo */}
            <div className="p-4 flex-1 flex flex-col">
              {archivoEditando === archivo._id ? (
                <div className="space-y-2">
                  <select
                    value={nuevoTipo}
                    onChange={(e) => {
                      setNuevoTipo(e.target.value);
                      setNuevoSubtipo(subtiposPorTipo[e.target.value]?.[0] || '');
                    }}
                    className="w-full text-xs rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2"
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
                    className="w-full text-xs rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2"
                  >
                    {subtiposPorTipo[nuevoTipo]?.map((subtipo) => (
                      <option key={subtipo} value={subtipo}>
                        {subtipo}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGuardarEdicion(archivo._id!)}
                      className="flex-1 text-xs px-3 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelarEdicion}
                      className="flex-1 text-xs px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    {getIconoArchivo(archivo.tipo)}
                    <p className="text-xs font-medium text-gray-900 truncate flex-1">
                      {archivo.nombreArchivo}
                    </p>
                  </div>
                  <div className="text-xs text-slate-600 mb-3">
                    <div>{archivo.tipo}</div>
                    {archivo.subtipo && <div className="text-slate-500">{archivo.subtipo}</div>}
                  </div>
                  {onEditarArchivo && archivo._id && (
                    <button
                      onClick={() => handleIniciarEdicion(archivo)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-auto"
                    >
                      <Edit2 size={12} />
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



