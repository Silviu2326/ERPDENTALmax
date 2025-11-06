import { useState, useRef } from 'react';
import { Upload, X, File, Image, File3D } from 'lucide-react';

interface ArchivoConMetadata {
  file: File;
  tipo: string;
  subtipo?: string;
}

interface UploaderArchivosDiagnosticoProps {
  archivos: ArchivoConMetadata[];
  onArchivosChange: (archivos: ArchivoConMetadata[]) => void;
  maxArchivos?: number;
}

export default function UploaderArchivosDiagnostico({
  archivos,
  onArchivosChange,
  maxArchivos = 50,
}: UploaderArchivosDiagnosticoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const nuevosArchivos: ArchivoConMetadata[] = Array.from(files)
      .slice(0, maxArchivos - archivos.length)
      .map(file => ({
        file,
        tipo: tiposArchivo[0], // Por defecto
        subtipo: subtiposPorTipo[tiposArchivo[0]]?.[0],
      }));

    onArchivosChange([...archivos, ...nuevosArchivos]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const eliminarArchivo = (index: number) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    onArchivosChange(nuevosArchivos);
  };

  const actualizarMetadata = (index: number, campo: 'tipo' | 'subtipo', valor: string) => {
    const nuevosArchivos = [...archivos];
    nuevosArchivos[index] = {
      ...nuevosArchivos[index],
      [campo]: valor,
      // Si cambia el tipo, resetear el subtipo al primero disponible
      ...(campo === 'tipo' && {
        subtipo: subtiposPorTipo[valor]?.[0],
      }),
    };
    onArchivosChange(nuevosArchivos);
  };

  const getIconoArchivo = (tipo: string) => {
    if (tipo.includes('Foto') || tipo.includes('Radiografía')) {
      return <Image className="w-5 h-5" />;
    }
    if (tipo.includes('3D')) {
      return <File3D className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="space-y-4">
      {/* Área de carga */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Arrastra archivos aquí o{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            selecciona archivos
          </button>
        </p>
        <p className="text-sm text-gray-500">
          Formatos soportados: JPG, PNG, DICOM, STL, OBJ, PLY
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.stl,.obj,.ply,.dcm"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Lista de archivos */}
      {archivos.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">
            Archivos seleccionados ({archivos.length})
          </h4>
          {archivos.map((archivoConMeta, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getIconoArchivo(archivoConMeta.tipo)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {archivoConMeta.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(archivoConMeta.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => eliminarArchivo(index)}
                  className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selectores de tipo y subtipo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={archivoConMeta.tipo}
                    onChange={(e) => actualizarMetadata(index, 'tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {tiposArchivo.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Subtipo
                  </label>
                  <select
                    value={archivoConMeta.subtipo || ''}
                    onChange={(e) => actualizarMetadata(index, 'subtipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subtiposPorTipo[archivoConMeta.tipo]?.map((subtipo) => (
                      <option key={subtipo} value={subtipo}>
                        {subtipo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


