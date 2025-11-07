import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import DocumentoItem from './DocumentoItem';
import { Documento } from '../api/documentosApi';

interface DocumentosListaProps {
  documentos: Documento[];
  onVer: (documento: Documento) => void;
  onDescargar: (documento: Documento) => void;
  onFirmar?: (documento: Documento) => void;
}

const tiposDocumento: Array<{ valor: string; etiqueta: string }> = [
  { valor: '', etiqueta: 'Todos los tipos' },
  { valor: 'Consentimiento', etiqueta: 'Consentimientos' },
  { valor: 'Receta', etiqueta: 'Recetas' },
  { valor: 'PlanTratamiento', etiqueta: 'Planes de Tratamiento' },
  { valor: 'Factura', etiqueta: 'Facturas' },
];

export default function DocumentosLista({
  documentos,
  onVer,
  onDescargar,
  onFirmar,
}: DocumentosListaProps) {
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');

  // Filtrar documentos
  const documentosFiltrados = documentos.filter((doc) => {
    const coincideTipo = !filtroTipo || doc.tipo === filtroTipo;
    const coincideBusqueda =
      !busqueda ||
      doc.nombreArchivo.toLowerCase().includes(busqueda.toLowerCase());

    return coincideTipo && coincideBusqueda;
  });

  // Agrupar por tipo
  const documentosAgrupados = documentosFiltrados.reduce(
    (acc, doc) => {
      if (!acc[doc.tipo]) {
        acc[doc.tipo] = [];
      }
      acc[doc.tipo].push(doc);
      return acc;
    },
    {} as Record<string, Documento[]>
  );

  const tiposConDocumentos = Object.keys(documentosAgrupados);

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por tipo */}
          <div className="sm:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {tiposDocumento.map((tipo) => (
                  <option key={tipo.valor} value={tipo.valor}>
                    {tipo.etiqueta}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      {documentosFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-lg">
            {busqueda || filtroTipo
              ? 'No se encontraron documentos con los filtros aplicados'
              : 'No tienes documentos disponibles'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {tiposConDocumentos.map((tipo) => (
            <div key={tipo}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {tiposDocumento.find((t) => t.valor === tipo)?.etiqueta || tipo}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({documentosAgrupados[tipo].length})
                </span>
              </h3>
              <div className="space-y-4">
                {documentosAgrupados[tipo].map((documento) => (
                  <DocumentoItem
                    key={documento._id}
                    documento={documento}
                    onVer={onVer}
                    onDescargar={onDescargar}
                    onFirmar={onFirmar}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



