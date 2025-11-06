import { Building2, MapPin, Globe, Users, Target, ArrowRight } from 'lucide-react';
import { EmpresaObjetivo, EstadoEmpresa } from '../api/abmApi';

interface AbmEmpresaListProps {
  empresas: EmpresaObjetivo[];
  onSeleccionarEmpresa: (empresaId: string) => void;
}

const ESTADO_COLORS: Record<EstadoEmpresa, string> = {
  Identificada: 'bg-gray-500',
  Contactada: 'bg-blue-500',
  Negociando: 'bg-yellow-500',
  Cliente: 'bg-green-500',
  Descartada: 'bg-red-500',
};

export default function AbmEmpresaList({
  empresas,
  onSeleccionarEmpresa,
}: AbmEmpresaListProps) {
  if (empresas.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay empresas objetivo registradas</p>
        <p className="text-gray-400 text-sm mt-2">Comienza agregando tu primera empresa objetivo</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {empresas.map((empresa) => (
        <div
          key={empresa._id}
          onClick={() => empresa._id && onSeleccionarEmpresa(empresa._id)}
          className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{empresa.nombre}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="font-medium">{empresa.sector}</span>
                  <span>•</span>
                  <span>{empresa.tamano}</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${ESTADO_COLORS[empresa.estado]}`}
              >
                {empresa.estado}
              </span>
            </div>

            {empresa.direccion && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{empresa.direccion}</span>
              </div>
            )}

            {empresa.sitioWeb && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Globe className="w-4 h-4 text-gray-400" />
                <a
                  href={empresa.sitioWeb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {empresa.sitioWeb}
                </a>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{empresa.contactos?.length || 0} contactos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{empresa.campañasAsociadas?.length || 0} campañas</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


