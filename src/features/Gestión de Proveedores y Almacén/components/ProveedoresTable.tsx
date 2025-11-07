import { useState } from 'react';
import { Building2, Phone, Mail, MapPin, MoreVertical, Edit, Eye, Trash2, CheckCircle, XCircle, Loader2, Package } from 'lucide-react';
import { Proveedor } from '../api/proveedoresApi';

interface ProveedoresTableProps {
  proveedores: Proveedor[];
  loading: boolean;
  onEditar: (proveedor: Proveedor) => void;
  onVerDetalle: (proveedor: Proveedor) => void;
  onDesactivar: (proveedorId: string) => void;
}

interface FilaProveedorProps {
  proveedor: Proveedor;
  onEditar: (proveedor: Proveedor) => void;
  onVerDetalle: (proveedor: Proveedor) => void;
  onDesactivar: (proveedorId: string) => void;
}

function FilaProveedor({
  proveedor,
  onEditar,
  onVerDetalle,
  onDesactivar,
}: FilaProveedorProps) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const getStatusBadge = (estado: string) => {
    if (estado === 'activo') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Activo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircle className="w-3 h-3" />
        Inactivo
      </span>
    );
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <button
            onClick={() => onVerDetalle(proveedor)}
            className="text-left font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {proveedor.nombreComercial}
          </button>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {proveedor.razonSocial || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {proveedor.rfc || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="flex flex-col gap-1">
          {proveedor.contactoPrincipal.nombre && (
            <span className="font-medium">{proveedor.contactoPrincipal.nombre}</span>
          )}
          {proveedor.contactoPrincipal.telefono && (
            <div className="flex items-center gap-1 text-gray-500">
              <Phone className="w-3 h-3" />
              <span>{proveedor.contactoPrincipal.telefono}</span>
            </div>
          )}
          {proveedor.contactoPrincipal.email && (
            <div className="flex items-center gap-1 text-gray-500">
              <Mail className="w-3 h-3" />
              <span className="truncate">{proveedor.contactoPrincipal.email}</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {proveedor.direccion ? (
          <div className="flex items-start gap-1">
            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              {proveedor.direccion.calle && <span>{proveedor.direccion.calle}</span>}
              {proveedor.direccion.ciudad && (
                <span className="text-gray-500">
                  {proveedor.direccion.ciudad}
                  {proveedor.direccion.estado && `, ${proveedor.direccion.estado}`}
                </span>
              )}
            </div>
          </div>
        ) : (
          '-'
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {proveedor.categorias && proveedor.categorias.length > 0 ? (
            proveedor.categorias.slice(0, 2).map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {cat}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">-</span>
          )}
          {proveedor.categorias && proveedor.categorias.length > 2 && (
            <span className="text-xs text-gray-500">
              +{proveedor.categorias.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {getStatusBadge(proveedor.estado)}
      </td>
      <td className="px-4 py-3">
        <div className="relative">
          <button
            onClick={() => setMostrarMenu(!mostrarMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menú de acciones"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {mostrarMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMostrarMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                <button
                  onClick={() => {
                    onVerDetalle(proveedor);
                    setMostrarMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalle
                </button>
                <button
                  onClick={() => {
                    onEditar(proveedor);
                    setMostrarMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                {proveedor.estado === 'activo' && (
                  <button
                    onClick={() => {
                      if (proveedor._id && window.confirm('¿Estás seguro de que deseas desactivar este proveedor?')) {
                        onDesactivar(proveedor._id);
                      }
                      setMostrarMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Desactivar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function ProveedoresTable({
  proveedores,
  loading,
  onEditar,
  onVerDetalle,
  onDesactivar,
}: ProveedoresTableProps) {
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (proveedores.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron proveedores</h3>
        <p className="text-gray-600 mb-4">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nombre Comercial
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Razón Social
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                RFC
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Contacto Principal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Categorías
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
            {proveedores.map((proveedor) => (
              <FilaProveedor
                key={proveedor._id}
                proveedor={proveedor}
                onEditar={onEditar}
                onVerDetalle={onVerDetalle}
                onDesactivar={onDesactivar}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



