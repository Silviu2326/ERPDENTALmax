import { Eye, Edit, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ControlEsterilizacion, ResultadoControl, TipoControl } from '../api/controlesApi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TablaHistorialControlesProps {
  controles: ControlEsterilizacion[];
  loading?: boolean;
  onVerDetalle: (control: ControlEsterilizacion) => void;
  onEditar?: (control: ControlEsterilizacion) => void;
}

export default function TablaHistorialControles({
  controles,
  loading = false,
  onVerDetalle,
  onEditar,
}: TablaHistorialControlesProps) {
  const getResultadoBadge = (resultado: ResultadoControl) => {
    const estilos = {
      pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      negativo: 'bg-green-100 text-green-800 border-green-200',
      positivo: 'bg-red-100 text-red-800 border-red-200',
      fallido: 'bg-red-100 text-red-800 border-red-200',
    };

    const iconos = {
      pendiente: <Clock className="w-4 h-4" />,
      negativo: <CheckCircle className="w-4 h-4" />,
      positivo: <AlertTriangle className="w-4 h-4" />,
      fallido: <XCircle className="w-4 h-4" />,
    };

    const etiquetas = {
      pendiente: 'Pendiente',
      negativo: 'Negativo',
      positivo: 'Positivo',
      fallido: 'Fallido',
    };

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${estilos[resultado]}`}
      >
        {iconos[resultado]}
        <span>{etiquetas[resultado]}</span>
      </span>
    );
  };

  const getTipoBadge = (tipo: TipoControl) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          tipo === 'biologico'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800'
        }`}
      >
        {tipo === 'biologico' ? 'Biológico' : 'Químico'}
      </span>
    );
  };

  const formatearFecha = (fecha: Date | string | undefined) => {
    if (!fecha) return '-';
    try {
      return format(new Date(fecha), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando controles...</p>
      </div>
    );
  }

  if (controles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No se encontraron controles registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autoclave
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lote Indicador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resultado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrado por
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {controles.map((control) => (
              <tr
                key={control._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatearFecha(control.fechaRegistro)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTipoBadge(control.tipoControl)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {control.idEsterilizador.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {control.loteIndicador}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getResultadoBadge(control.resultado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {control.idUsuarioRegistro.nombre} {control.idUsuarioRegistro.apellidos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onVerDetalle(control)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1.5 rounded hover:bg-blue-50"
                      title="Ver detalle"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {onEditar && (control.resultado === 'pendiente' || control.tipoControl === 'biologico') && (
                      <button
                        onClick={() => onEditar(control)}
                        className="text-green-600 hover:text-green-900 transition-colors p-1.5 rounded hover:bg-green-50"
                        title="Editar resultado"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
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


