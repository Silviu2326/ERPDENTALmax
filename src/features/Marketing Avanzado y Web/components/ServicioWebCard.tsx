import { Eye, Pencil, Trash2, Star, Globe, FileText } from 'lucide-react';
import { ServicioWeb } from '../api/serviciosWebAPI';

interface ServicioWebCardProps {
  servicio: ServicioWeb;
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
  onVerDetalle?: (id: string) => void;
}

export default function ServicioWebCard({
  servicio,
  onEditar,
  onEliminar,
  onVerDetalle,
}: ServicioWebCardProps) {
  const categoriaNombre =
    typeof servicio.categoria === 'object' && servicio.categoria
      ? servicio.categoria.nombre
      : servicio.categoria || 'Sin categoría';

  const precioMostrar = servicio.precioPromocional || servicio.precio;
  const tieneDescuento = servicio.precioPromocional && servicio.precioPromocional < servicio.precio;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
      {/* Imagen del servicio */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
        {servicio.imagenes && servicio.imagenes.length > 0 ? (
          <img
            src={servicio.imagenes[0]}
            alt={servicio.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-16 h-16 text-blue-300" />
          </div>
        )}
        
        {/* Badges de estado */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {servicio.destacado && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3" />
              Destacado
            </span>
          )}
          {servicio.publicado ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Publicado
            </span>
          ) : (
            <span className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Borrador
            </span>
          )}
        </div>

        {tieneDescuento && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            Oferta
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{servicio.nombre}</h3>
          <p className="text-xs text-gray-500 mb-2">{categoriaNombre}</p>
          {servicio.descripcionCorta && (
            <p className="text-sm text-gray-600 line-clamp-2">{servicio.descripcionCorta}</p>
          )}
        </div>

        {/* Precio */}
        <div className="flex items-center gap-2 mb-4">
          {tieneDescuento && (
            <span className="text-sm text-gray-400 line-through">
              {servicio.precio.toFixed(2)} €
            </span>
          )}
          <span className="text-xl font-bold text-blue-600">
            {precioMostrar.toFixed(2)} €
          </span>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex gap-2">
            {onVerDetalle && (
              <button
                onClick={() => servicio._id && onVerDetalle(servicio._id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver detalle"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => servicio._id && onEditar(servicio._id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => servicio._id && onEliminar(servicio._id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


