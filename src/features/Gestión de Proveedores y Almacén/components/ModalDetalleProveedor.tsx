import { X, Building2, User, Mail, Phone, MapPin, FileText, Tag, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Proveedor } from '../api/proveedoresApi';

interface ModalDetalleProveedorProps {
  proveedor: Proveedor;
  onCerrar: () => void;
  onEditar: () => void;
}

export default function ModalDetalleProveedor({
  proveedor,
  onCerrar,
  onEditar,
}: ModalDetalleProveedorProps) {
  const formatearFecha = (fecha?: string) => {
    if (!fecha) return '-';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  const getStatusBadge = (estado: string) => {
    if (estado === 'activo') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4" />
          Activo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <XCircle className="w-4 h-4" />
        Inactivo
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{proveedor.nombreComercial}</h2>
              {proveedor.razonSocial && (
                <p className="text-sm text-gray-500">{proveedor.razonSocial}</p>
              )}
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Estado:</span>
            {getStatusBadge(proveedor.estado)}
          </div>

          {/* Información Básica */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Comercial
                </label>
                <p className="text-gray-900">{proveedor.nombreComercial}</p>
              </div>
              {proveedor.razonSocial && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razón Social
                  </label>
                  <p className="text-gray-900">{proveedor.razonSocial}</p>
                </div>
              )}
              {proveedor.rfc && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RFC
                  </label>
                  <p className="text-gray-900 font-mono">{proveedor.rfc}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contacto Principal */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Contacto Principal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Nombre
                </label>
                <p className="text-gray-900">{proveedor.contactoPrincipal.nombre}</p>
              </div>
              {proveedor.contactoPrincipal.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <a
                    href={`mailto:${proveedor.contactoPrincipal.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {proveedor.contactoPrincipal.email}
                  </a>
                </div>
              )}
              {proveedor.contactoPrincipal.telefono && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </label>
                  <a
                    href={`tel:${proveedor.contactoPrincipal.telefono}`}
                    className="text-blue-600 hover:underline"
                  >
                    {proveedor.contactoPrincipal.telefono}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dirección */}
          {proveedor.direccion && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Dirección
              </h3>
              <div className="space-y-2">
                {proveedor.direccion.calle && (
                  <p className="text-gray-900">{proveedor.direccion.calle}</p>
                )}
                {(proveedor.direccion.ciudad || proveedor.direccion.estado || proveedor.direccion.codigoPostal) && (
                  <p className="text-gray-600">
                    {[
                      proveedor.direccion.ciudad,
                      proveedor.direccion.estado,
                      proveedor.direccion.codigoPostal,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Categorías */}
          {proveedor.categorias && proveedor.categorias.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Categorías de Productos
              </h3>
              <div className="flex flex-wrap gap-2">
                {proveedor.categorias.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Condiciones y Notas */}
          {(proveedor.condicionesPago || proveedor.notas) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>
              <div className="space-y-4">
                {proveedor.condicionesPago && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condiciones de Pago
                    </label>
                    <p className="text-gray-900">{proveedor.condicionesPago}</p>
                  </div>
                )}
                {proveedor.notas && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">{proveedor.notas}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fechas */}
          {(proveedor.createdAt || proveedor.updatedAt) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Fechas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proveedor.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Creado el
                    </label>
                    <p className="text-gray-900">{formatearFecha(proveedor.createdAt)}</p>
                  </div>
                )}
                {proveedor.updatedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Última actualización
                    </label>
                    <p className="text-gray-900">{formatearFecha(proveedor.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onCerrar}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={onEditar}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Editar Proveedor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


