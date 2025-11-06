import { useState, useEffect } from 'react';
import { Calendar, FileText, CheckSquare, Square } from 'lucide-react';
import {
  FormatoExportacionDisponible,
  FormatoExportacion,
  TipoDatoExportacion,
  obtenerFormatosDisponibles,
} from '../api/contabilidadApi';

export interface ParametrosExportacionForm {
  fechaInicio: string;
  fechaFin: string;
  formato: FormatoExportacion | '';
  tiposDatos: TipoDatoExportacion[];
}

interface FormularioExportacionProps {
  parametros: ParametrosExportacionForm;
  onParametrosChange: (parametros: ParametrosExportacionForm) => void;
  onGenerarExportacion: () => void;
  loading?: boolean;
}

export default function FormularioExportacion({
  parametros,
  onParametrosChange,
  onGenerarExportacion,
  loading = false,
}: FormularioExportacionProps) {
  const [formatosDisponibles, setFormatosDisponibles] = useState<FormatoExportacionDisponible[]>([]);
  const [loadingFormatos, setLoadingFormatos] = useState(true);

  // Inicializar con el último mes por defecto
  useEffect(() => {
    const ahora = new Date();
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

    if (!parametros.fechaInicio || !parametros.fechaFin) {
      onParametrosChange({
        ...parametros,
        fechaInicio: primerDiaMes.toISOString().split('T')[0],
        fechaFin: ultimoDiaMes.toISOString().split('T')[0],
      });
    }
  }, []);

  useEffect(() => {
    const cargarFormatos = async () => {
      setLoadingFormatos(true);
      try {
        const formatos = await obtenerFormatosDisponibles();
        setFormatosDisponibles(formatos);
        // Seleccionar el primer formato por defecto
        if (!parametros.formato && formatos.length > 0) {
          onParametrosChange({
            ...parametros,
            formato: formatos[0].id,
          });
        }
      } catch (error) {
        console.error('Error al cargar formatos:', error);
      } finally {
        setLoadingFormatos(false);
      }
    };

    cargarFormatos();
  }, []);

  const tiposDatos: Array<{ id: TipoDatoExportacion; label: string; descripcion: string }> = [
    { id: 'facturas', label: 'Facturas Emitidas', descripcion: 'Incluir todas las facturas emitidas en el período' },
    { id: 'cobros', label: 'Cobros Realizados', descripcion: 'Incluir todos los cobros registrados en el período' },
    { id: 'gastos', label: 'Gastos', descripcion: 'Incluir todos los gastos registrados en el período' },
  ];

  const toggleTipoDato = (tipo: TipoDatoExportacion) => {
    const nuevosTipos = parametros.tiposDatos.includes(tipo)
      ? parametros.tiposDatos.filter((t) => t !== tipo)
      : [...parametros.tiposDatos, tipo];
    
    onParametrosChange({
      ...parametros,
      tiposDatos: nuevosTipos,
    });
  };

  const puedeGenerar = 
    parametros.fechaInicio &&
    parametros.fechaFin &&
    parametros.formato &&
    parametros.tiposDatos.length > 0 &&
    new Date(parametros.fechaInicio) <= new Date(parametros.fechaFin);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Parámetros de Exportación</h2>
      </div>

      <div className="space-y-6">
        {/* Rango de Fechas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Rango de Fechas
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={parametros.fechaInicio}
                onChange={(e) =>
                  onParametrosChange({
                    ...parametros,
                    fechaInicio: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                max={parametros.fechaFin || undefined}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={parametros.fechaFin}
                onChange={(e) =>
                  onParametrosChange({
                    ...parametros,
                    fechaFin: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={parametros.fechaInicio || undefined}
              />
            </div>
          </div>
        </div>

        {/* Formato de Exportación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Formato de Exportación
          </label>
          {loadingFormatos ? (
            <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
          ) : (
            <select
              value={parametros.formato}
              onChange={(e) =>
                onParametrosChange({
                  ...parametros,
                  formato: e.target.value as FormatoExportacion,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un formato...</option>
              {formatosDisponibles.map((formato) => (
                <option key={formato.id} value={formato.id}>
                  {formato.nombre} {formato.descripcion ? `- ${formato.descripcion}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Tipos de Datos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <CheckSquare className="w-4 h-4 inline mr-2" />
            Tipos de Datos a Exportar
          </label>
          <div className="space-y-3">
            {tiposDatos.map((tipo) => {
              const estaSeleccionado = parametros.tiposDatos.includes(tipo.id);
              return (
                <label
                  key={tipo.id}
                  className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    estaSeleccionado
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="mt-1">
                    {estaSeleccionado ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{tipo.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{tipo.descripcion}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={estaSeleccionado}
                    onChange={() => toggleTipoDato(tipo.id)}
                    className="sr-only"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Botón de Generar */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onGenerarExportacion}
            disabled={!puedeGenerar || loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generando Exportación...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Generar Exportación</span>
              </>
            )}
          </button>
          {!puedeGenerar && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Por favor complete todos los campos requeridos
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


