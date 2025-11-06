import { useState } from 'react';
import { Warehouse, MapPin, User, MoreVertical, Edit, Eye, Trash2, ArrowRightLeft, CheckCircle, XCircle, Star } from 'lucide-react';
import { Almacen } from '../api/almacenesApi';

interface AlmacenesDataTableProps {
  almacenes: Almacen[];
  loading: boolean;
  onEditar: (almacen: Almacen) => void;
  onVerDetalle: (almacenId: string) => void;
  onEliminar: (almacenId: string) => void;
  onTransferir: (almacen: Almacen) => void;
}

interface FilaAlmacenProps {
  almacen: Almacen;
  onEditar: (almacen: Almacen) => void;
  onVerDetalle: (almacenId: string) => void;
  onEliminar: (almacenId: string) => void;
  onTransferir: (almacen: Almacen) => void;
}

function FilaAlmacen({
  almacen,
  onEditar,
  onVerDetalle,
  onEliminar,
  onTransferir,
}: FilaAlmacenProps) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  return (
    <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Warehouse className="w-5 h-5 text-blue-600" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVerDetalle(almacen._id!)}
              className="text-left font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              {almacen.nombre}
            </button>
            {almacen.esPrincipal && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" title="Almacén principal" />
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {almacen.direccion ? (
          <div className="flex items-start gap-1">
            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <span>{almacen.direccion.calle}</span>
              <span className="text-gray-500">
                {almacen.direccion.ciudad}, {almacen.direccion.codigoPostal}
              </span>
            </div>
          </div>
        ) : (
          '-'
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {almacen.clinicaAsociada?.nombre || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {almacen.responsable ? (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-gray-400" />
            <span>{almacen.responsable.nombre} {almacen.responsable.apellidos || ''}</span>
          </div>
        ) : (
          '-'
        )}
      </td>
      <td className="px-4 py-3">
        {almacen.activo ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Activo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3" />
            Inactivo
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Más opciones"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          {mostrarMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMostrarMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <button
                  onClick={() => {
                    onVerDetalle(almacen._id!);
                    setMostrarMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalle
                </button>
                <button
                  onClick={() => {
                    onEditar(almacen);
                    setMostrarMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    onTransferir(almacen);
                    setMostrarMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Transferir Stock
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Está seguro de eliminar el almacén "${almacen.nombre}"?`)) {
                      onEliminar(almacen._id!);
                    }
                    setMostrarMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function AlmacenesDataTable({
  almacenes,
  loading,
  onEditar,
  onVerDetalle,
  onEliminar,
  onTransferir,
}: AlmacenesDataTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando almacenes...</div>
      </div>
    );
  }

  if (almacenes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Warehouse className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-medium">No hay almacenes registrados</p>
        <p className="text-gray-400 text-sm mt-2">Crea tu primer almacén para comenzar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Dirección
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Clínica Asociada
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Responsable
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {almacenes.map((almacen) => (
            <FilaAlmacen
              key={almacen._id}
              almacen={almacen}
              onEditar={onEditar}
              onVerDetalle={onVerDetalle}
              onEliminar={onEliminar}
              onTransferir={onTransferir}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


