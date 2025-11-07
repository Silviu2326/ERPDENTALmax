import { useState, useRef } from 'react';
import { Upload, X, File, Image, Layers } from 'lucide-react';

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
      return <Layers className="w-5 h-5" />;
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
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        }`}
      >
        <Upload size={48} className="text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 mb-2">
          Arrastra archivos aquí o{' '}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            selecciona archivos
          </button>
        </p>
        <p className="text-sm text-slate-500">
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
          <h4 className="text-sm font-medium text-slate-700">
            Archivos seleccionados ({archivos.length})
          </h4>
          {archivos.map((archivoConMeta, index) => (
            <div
              key={index}
              className="bg-white ring-1 ring-slate-200 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getIconoArchivo(archivoConMeta.tipo)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {archivoConMeta.file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(archivoConMeta.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => eliminarArchivo(index)}
                  className="p-1 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Selectores de tipo y subtipo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={archivoConMeta.tipo}
                    onChange={(e) => actualizarMetadata(index, 'tipo', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
                  >
                    {tiposArchivo.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Subtipo
                  </label>
                  <select
                    value={archivoConMeta.subtipo || ''}
                    onChange={(e) => actualizarMetadata(index, 'subtipo', e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
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



