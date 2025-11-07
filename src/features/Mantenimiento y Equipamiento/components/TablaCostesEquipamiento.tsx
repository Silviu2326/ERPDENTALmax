import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2, Package } from 'lucide-react';
import { CosteEquipo } from '../api/informesEquipamientoApi';

interface TablaCostesEquipamientoProps {
  costes: CosteEquipo[];
  loading?: boolean;
}

type CampoOrden = 'nombre' | 'costoAdquisicion' | 'costeTotal' | 'depreciacion';
type DireccionOrden = 'asc' | 'desc';

export default function TablaCostesEquipamiento({
  costes,
  loading = false,
}: TablaCostesEquipamientoProps) {
  const [campoOrden, setCampoOrden] = useState<CampoOrden>('nombre');
  const [direccionOrden, setDireccionOrden] = useState<DireccionOrden>('asc');

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleOrdenar = (campo: CampoOrden) => {
    if (campoOrden === campo) {
      setDireccionOrden(direccionOrden === 'asc' ? 'desc' : 'asc');
    } else {
      setCampoOrden(campo);
      setDireccionOrden('asc');
    }
  };

  const costesOrdenados = [...costes].sort((a, b) => {
    let valorA: number | string;
    let valorB: number | string;

    switch (campoOrden) {
      case 'nombre':
        valorA = a.nombre.toLowerCase();
        valorB = b.nombre.toLowerCase();
        break;
      case 'costoAdquisicion':
        valorA = a.costoAdquisicion;
        valorB = b.costoAdquisicion;
        break;
      case 'costeTotal':
        valorA = a.costeTotal;
        valorB = b.costeTotal;
        break;
      case 'depreciacion':
        valorA = a.depreciacion;
        valorB = b.depreciacion;
        break;
      default:
        return 0;
    }

    if (typeof valorA === 'string' && typeof valorB === 'string') {
      return direccionOrden === 'asc'
        ? valorA.localeCompare(valorB)
        : valorB.localeCompare(valorA);
    } else {
      return direccionOrden === 'asc'
        ? (valorA as number) - (valorB as number)
        : (valorB as number) - (valorA as number);
    }
  });

  const IconoOrden = ({ campo }: { campo: CampoOrden }) => {
    if (campoOrden !== campo) {
      return <ArrowUpDown className="w-4 h-4 text-slate-400" />;
    }
    return direccionOrden === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (costes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos para mostrar</h3>
        <p className="text-gray-600">Ajusta los filtros para ver resultados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleOrdenar('nombre')}
              >
                <div className="flex items-center gap-2">
                  Equipo
                  <IconoOrden campo="nombre" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Sede
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleOrdenar('costoAdquisicion')}
              >
                <div className="flex items-center justify-end gap-2">
                  Coste Adquisición
                  <IconoOrden campo="costoAdquisicion" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Mant. Preventivo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Mant. Correctivo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Reparaciones
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleOrdenar('costeTotal')}
              >
                <div className="flex items-center justify-end gap-2">
                  Coste Total
                  <IconoOrden campo="costeTotal" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleOrdenar('depreciacion')}
              >
                <div className="flex items-center justify-end gap-2">
                  Depreciación
                  <IconoOrden campo="depreciacion" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {costesOrdenados.map((coste) => (
              <tr key={coste.equipoId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {coste.nombre}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatearFecha(coste.fechaAdquisicion)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {coste.categoria.nombre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{coste.sede.nombre}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatearMoneda(coste.costoAdquisicion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatearMoneda(coste.costeMantenimientoPreventivo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatearMoneda(coste.costeMantenimientoCorrectivo)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatearMoneda(coste.costeReparaciones)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  {formatearMoneda(coste.costeTotal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatearMoneda(coste.depreciacion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      coste.estado === 'Operativo'
                        ? 'bg-green-100 text-green-800'
                        : coste.estado === 'En Mantenimiento'
                        ? 'bg-yellow-100 text-yellow-800'
                        : coste.estado === 'Fuera de Servicio'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {coste.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



