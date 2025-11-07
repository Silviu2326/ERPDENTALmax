import { Building2, MapPin, Globe, Users, Target, ArrowRight } from 'lucide-react';
import { EmpresaObjetivo, EstadoEmpresa } from '../api/abmApi';

interface AbmEmpresaListProps {
  empresas: EmpresaObjetivo[];
  onSeleccionarEmpresa: (empresaId: string) => void;
}

const ESTADO_COLORS: Record<EstadoEmpresa, { bg: string; text: string }> = {
  Identificada: { bg: 'bg-gray-100', text: 'text-gray-700' },
  Contactada: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Negociando: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  Cliente: { bg: 'bg-green-100', text: 'text-green-700' },
  Descartada: { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function AbmEmpresaList({
  empresas,
  onSeleccionarEmpresa,
}: AbmEmpresaListProps) {
  if (empresas.length === 0) {
    return (
      <div className="p-8 text-center bg-white">
        <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay empresas objetivo registradas
        </h3>
        <p className="text-gray-600 mb-4">
          Comienza agregando tu primera empresa objetivo
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {empresas.map((empresa) => {
        const estadoColors = ESTADO_COLORS[empresa.estado];
        return (
          <div
            key={empresa._id}
            onClick={() => empresa._id && onSeleccionarEmpresa(empresa._id)}
            className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow h-full flex flex-col overflow-hidden cursor-pointer"
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {empresa.nombre}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="font-medium">{empresa.sector}</span>
                    <span>•</span>
                    <span className="truncate">{empresa.tamano}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium ${estadoColors.bg} ${estadoColors.text} flex-shrink-0 ml-2`}
                >
                  {empresa.estado}
                </span>
              </div>

              <div className="space-y-2 mb-4 flex-1">
                {empresa.direccion && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{empresa.direccion}</span>
                  </div>
                )}

                {empresa.sitioWeb && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe size={16} className="text-gray-400 flex-shrink-0" />
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
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users size={16} className="text-gray-400" />
                    <span>{empresa.contactos?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target size={16} className="text-gray-400" />
                    <span>{empresa.campañasAsociadas?.length || 0}</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}



