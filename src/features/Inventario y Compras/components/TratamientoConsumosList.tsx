import { useState, useEffect } from 'react';
import { Search, Edit, Package, Loader2 } from 'lucide-react';
import { obtenerTratamientos, Tratamiento, FiltrosTratamientos } from '../api/tratamientoConsumosApi';
import ModalEditarConsumos from './ModalEditarConsumos';

interface TratamientoConsumosListProps {
  // Props opcionales para futuras funcionalidades
}

export default function TratamientoConsumosList({}: TratamientoConsumosListProps = {}) {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosTratamientos>({
    page: 1,
    limit: 20,
  });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState<Tratamiento | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarTratamientos = async () => {
    try {
      setLoading(true);
      setError(null);
      // Datos falsos completos - NO usar API
      const tratamientosMock: Tratamiento[] = [
        {
          _id: '1',
          nombre: 'Limpieza Dental Profunda',
          codigo: 'TRAT-001',
          precio: 85.00,
          totalConsumos: 5,
          consumos: [
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
            { producto: { _id: '2', nombre: 'Agujas Desechables 27G', unidadMedida: 'cajas', sku: 'AGU-27G-006' }, cantidad: 1 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 2 },
            { producto: { _id: '4', nombre: 'Seda Dental', unidadMedida: 'rollos', sku: 'SEDA-014' }, cantidad: 0.5 },
            { producto: { _id: '5', nombre: 'Gel Desinfectante Clorhexidina', unidadMedida: 'tubos', sku: 'GEL-CHX-010' }, cantidad: 0.1 },
          ],
        },
        {
          _id: '2',
          nombre: 'Obturación Composite',
          codigo: 'TRAT-002',
          precio: 120.00,
          totalConsumos: 4,
          consumos: [
            { producto: { _id: '6', nombre: 'Resina Composite A2', unidadMedida: 'unidades', sku: 'COMP-A2-001' }, cantidad: 1 },
            { producto: { _id: '7', nombre: 'Cemento de Ionómero de Vidrio', unidadMedida: 'unidades', sku: 'CEM-IV-005' }, cantidad: 0.5 },
            { producto: { _id: '2', nombre: 'Agujas Desechables 27G', unidadMedida: 'cajas', sku: 'AGU-27G-006' }, cantidad: 1 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 1 },
          ],
        },
        {
          _id: '3',
          nombre: 'Extracción Dental Simple',
          codigo: 'TRAT-003',
          precio: 95.00,
          totalConsumos: 6,
          consumos: [
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
            { producto: { _id: '2', nombre: 'Agujas Desechables 27G', unidadMedida: 'cajas', sku: 'AGU-27G-006' }, cantidad: 1 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 2 },
            { producto: { _id: '8', nombre: 'Gasa Estéril', unidadMedida: 'paquetes', sku: 'GASA-EST-008' }, cantidad: 2 },
            { producto: { _id: '9', nombre: 'Algodón Estéril', unidadMedida: 'paquetes', sku: 'ALG-EST-009' }, cantidad: 1 },
            { producto: { _id: '5', nombre: 'Gel Desinfectante Clorhexidina', unidadMedida: 'tubos', sku: 'GEL-CHX-010' }, cantidad: 0.2 },
          ],
        },
        {
          _id: '4',
          nombre: 'Blanqueamiento Dental',
          codigo: 'TRAT-004',
          precio: 250.00,
          totalConsumos: 3,
          consumos: [
            { producto: { _id: '10', nombre: 'Gel Blanqueador', unidadMedida: 'tubos', sku: 'GEL-BLAN-010' }, cantidad: 1 },
            { producto: { _id: '11', nombre: 'Férulas Personalizadas', unidadMedida: 'unidades', sku: 'FER-PER-011' }, cantidad: 1 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
          ],
        },
        {
          _id: '5',
          nombre: 'Endodoncia Unirradicular',
          codigo: 'TRAT-005',
          precio: 350.00,
          totalConsumos: 8,
          consumos: [
            { producto: { _id: '12', nombre: 'Limas Endodóncicas', unidadMedida: 'juegos', sku: 'LIM-END-012' }, cantidad: 1 },
            { producto: { _id: '13', nombre: 'Gutapercha', unidadMedida: 'conos', sku: 'GUT-013' }, cantidad: 3 },
            { producto: { _id: '14', nombre: 'Cemento Endodóncico', unidadMedida: 'unidades', sku: 'CEM-END-014' }, cantidad: 1 },
            { producto: { _id: '2', nombre: 'Agujas Desechables 27G', unidadMedida: 'cajas', sku: 'AGU-27G-006' }, cantidad: 1 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 2 },
            { producto: { _id: '15', nombre: 'Radiografía Digital', unidadMedida: 'unidades', sku: 'RAD-DIG-015' }, cantidad: 2 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
            { producto: { _id: '5', nombre: 'Gel Desinfectante Clorhexidina', unidadMedida: 'tubos', sku: 'GEL-CHX-010' }, cantidad: 0.3 },
          ],
        },
        {
          _id: '6',
          nombre: 'Ortodoncia - Ajuste Brackets',
          codigo: 'TRAT-006',
          precio: 75.00,
          totalConsumos: 4,
          consumos: [
            { producto: { _id: '16', nombre: 'Brackets Metálicos Autoligantes', unidadMedida: 'juegos', sku: 'BRAC-MET-007' }, cantidad: 0.1 },
            { producto: { _id: '17', nombre: 'Alambre Ortodóncico', unidadMedida: 'metros', sku: 'ALAM-ORT-017' }, cantidad: 0.5 },
            { producto: { _id: '18', nombre: 'Ligaduras Elásticas', unidadMedida: 'paquetes', sku: 'LIG-ELAS-018' }, cantidad: 1 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
          ],
        },
        {
          _id: '7',
          nombre: 'Periodoncia - Raspado y Alisado',
          codigo: 'TRAT-007',
          precio: 180.00,
          totalConsumos: 5,
          consumos: [
            { producto: { _id: '19', nombre: 'Curetas Periodontales', unidadMedida: 'juegos', sku: 'CUR-PER-019' }, cantidad: 1 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 2 },
            { producto: { _id: '20', nombre: 'Antiséptico Bucal', unidadMedida: 'botellas', sku: 'ANT-BUC-020' }, cantidad: 0.5 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
            { producto: { _id: '5', nombre: 'Gel Desinfectante Clorhexidina', unidadMedida: 'tubos', sku: 'GEL-CHX-010' }, cantidad: 0.2 },
          ],
        },
        {
          _id: '8',
          nombre: 'Implante Dental',
          codigo: 'TRAT-008',
          precio: 1200.00,
          totalConsumos: 7,
          consumos: [
            { producto: { _id: '21', nombre: 'Implante Dental Titanio', unidadMedida: 'unidades', sku: 'IMPL-TIT-003' }, cantidad: 1 },
            { producto: { _id: '22', nombre: 'Pilar de Cicatrización', unidadMedida: 'unidades', sku: 'PIL-CIC-022' }, cantidad: 1 },
            { producto: { _id: '23', nombre: 'Fresas Quirúrgicas', unidadMedida: 'juegos', sku: 'FRES-QUI-023' }, cantidad: 1 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 3 },
            { producto: { _id: '15', nombre: 'Radiografía Digital', unidadMedida: 'unidades', sku: 'RAD-DIG-015' }, cantidad: 3 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 2 },
            { producto: { _id: '5', nombre: 'Gel Desinfectante Clorhexidina', unidadMedida: 'tubos', sku: 'GEL-CHX-010' }, cantidad: 0.5 },
          ],
        },
        {
          _id: '9',
          nombre: 'Corona Provisional',
          codigo: 'TRAT-009',
          precio: 150.00,
          totalConsumos: 4,
          consumos: [
            { producto: { _id: '24', nombre: 'Resina Composite A2', unidadMedida: 'unidades', sku: 'COMP-A2-001' }, cantidad: 1 },
            { producto: { _id: '25', nombre: 'Cemento de Ionómero de Vidrio', unidadMedida: 'unidades', sku: 'CEM-IV-005' }, cantidad: 0.5 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 1 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
          ],
        },
        {
          _id: '10',
          nombre: 'Profilaxis Dental',
          codigo: 'TRAT-010',
          precio: 60.00,
          totalConsumos: 3,
          consumos: [
            { producto: { _id: '26', nombre: 'Fresas de Carburo Tungsteno', unidadMedida: 'juegos', sku: 'FRES-CT-011' }, cantidad: 0.2 },
            { producto: { _id: '27', nombre: 'Pasta Profiláctica', unidadMedida: 'tubos', sku: 'PASTA-PROF-027' }, cantidad: 0.1 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
          ],
        },
        {
          _id: '11',
          nombre: 'Endodoncia Birradicular',
          codigo: 'TRAT-011',
          precio: 450.00,
          totalConsumos: 9,
          consumos: [
            { producto: { _id: '12', nombre: 'Limas Endodóncicas', unidadMedida: 'juegos', sku: 'LIM-END-012' }, cantidad: 1 },
            { producto: { _id: '13', nombre: 'Gutapercha', unidadMedida: 'conos', sku: 'GUT-013' }, cantidad: 4 },
            { producto: { _id: '14', nombre: 'Cemento Endodóncico', unidadMedida: 'unidades', sku: 'CEM-END-014' }, cantidad: 1 },
            { producto: { _id: '2', nombre: 'Agujas Desechables 27G', unidadMedida: 'cajas', sku: 'AGU-27G-006' }, cantidad: 1 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 2 },
            { producto: { _id: '15', nombre: 'Radiografía Digital', unidadMedida: 'unidades', sku: 'RAD-DIG-015' }, cantidad: 3 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
            { producto: { _id: '5', nombre: 'Gel Desinfectante Clorhexidina', unidadMedida: 'tubos', sku: 'GEL-CHX-010' }, cantidad: 0.3 },
            { producto: { _id: '28', nombre: 'Gasa Estéril', unidadMedida: 'paquetes', sku: 'GASA-EST-008' }, cantidad: 1 },
          ],
        },
        {
          _id: '12',
          nombre: 'Ortodoncia - Colocación Brackets',
          codigo: 'TRAT-012',
          precio: 200.00,
          totalConsumos: 5,
          consumos: [
            { producto: { _id: '16', nombre: 'Brackets Metálicos Autoligantes', unidadMedida: 'juegos', sku: 'BRAC-MET-007' }, cantidad: 0.1 },
            { producto: { _id: '17', nombre: 'Alambre Ortodóncico', unidadMedida: 'metros', sku: 'ALAM-ORT-017' }, cantidad: 0.3 },
            { producto: { _id: '18', nombre: 'Ligaduras Elásticas', unidadMedida: 'paquetes', sku: 'LIG-ELAS-018' }, cantidad: 1 },
            { producto: { _id: '29', nombre: 'Cemento de Fosfato de Zinc', unidadMedida: 'unidades', sku: 'CEM-FOS-029' }, cantidad: 0.2 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
          ],
        },
        {
          _id: '13',
          nombre: 'Periodoncia - Cirugía Gingival',
          codigo: 'TRAT-013',
          precio: 280.00,
          totalConsumos: 6,
          consumos: [
            { producto: { _id: '19', nombre: 'Curetas Periodontales', unidadMedida: 'juegos', sku: 'CUR-PER-019' }, cantidad: 1 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 3 },
            { producto: { _id: '20', nombre: 'Antiséptico Bucal', unidadMedida: 'botellas', sku: 'ANT-BUC-020' }, cantidad: 0.5 },
            { producto: { _id: '28', nombre: 'Gasa Estéril', unidadMedida: 'paquetes', sku: 'GASA-EST-008' }, cantidad: 3 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 2 },
            { producto: { _id: '5', nombre: 'Gel Desinfectante Clorhexidina', unidadMedida: 'tubos', sku: 'GEL-CHX-010' }, cantidad: 0.4 },
          ],
        },
        {
          _id: '14',
          nombre: 'Reconstrucción con Poste',
          codigo: 'TRAT-014',
          precio: 180.00,
          totalConsumos: 5,
          consumos: [
            { producto: { _id: '30', nombre: 'Poste Endodóncico', unidadMedida: 'unidades', sku: 'POST-END-030' }, cantidad: 1 },
            { producto: { _id: '6', nombre: 'Resina Composite A2', unidadMedida: 'unidades', sku: 'COMP-A2-001' }, cantidad: 1 },
            { producto: { _id: '3', nombre: 'Anestésico Lidocaína 2%', unidadMedida: 'ampollas', sku: 'ANES-LID-002' }, cantidad: 1 },
            { producto: { _id: '31', nombre: 'Cemento de Resina', unidadMedida: 'unidades', sku: 'CEM-RES-031' }, cantidad: 1 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
          ],
        },
        {
          _id: '15',
          nombre: 'Aplicación de Flúor',
          codigo: 'TRAT-015',
          precio: 40.00,
          totalConsumos: 2,
          consumos: [
            { producto: { _id: '32', nombre: 'Gel de Flúor', unidadMedida: 'tubos', sku: 'GEL-FLU-032' }, cantidad: 0.1 },
            { producto: { _id: '1', nombre: 'Guantes de Nitrilo', unidadMedida: 'cajas', sku: 'GUANT-NIT-M' }, cantidad: 1 },
          ],
        },
      ];

      // Aplicar filtros
      let tratamientosFiltrados = [...tratamientosMock];

      if (filtros.search) {
        const busqueda = filtros.search.toLowerCase();
        tratamientosFiltrados = tratamientosFiltrados.filter(
          (t) =>
            t.nombre.toLowerCase().includes(busqueda) ||
            t.codigo?.toLowerCase().includes(busqueda)
        );
      }

      // Paginación
      const limit = filtros.limit || 20;
      const page = filtros.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      setTratamientos(tratamientosFiltrados.slice(startIndex, endIndex));
      setTotal(tratamientosFiltrados.length);
      setTotalPages(Math.ceil(tratamientosFiltrados.length / limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar tratamientos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar tratamientos al montar y cuando cambian los filtros
  useEffect(() => {
    cargarTratamientos();
  }, [filtros.page, filtros.limit, filtros.search]);

  const handleBuscar = () => {
    setFiltros({
      ...filtros,
      search: busqueda || undefined,
      page: 1,
    });
    // El useEffect se encargará de cargar cuando cambien los filtros
  };

  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setFiltros({
      ...filtros,
      search: undefined,
      page: 1,
    });
    // El useEffect se encargará de cargar cuando cambien los filtros
  };

  const handleEditarConsumos = (tratamiento: Tratamiento) => {
    setTratamientoSeleccionado(tratamiento);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setTratamientoSeleccionado(null);
  };

  const handleGuardado = () => {
    cargarTratamientos();
  };

  const handleCambiarPagina = (nuevaPagina: number) => {
    setFiltros({
      ...filtros,
      page: nuevaPagina,
    });
    // El useEffect se encargará de cargar cuando cambien los filtros
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Consumos por Tratamiento</h1>
        <p className="text-sm text-gray-600 mb-4">
          Gestiona los materiales y cantidades consumidas por cada tratamiento
        </p>
        
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              placeholder="Buscar tratamiento por nombre o código..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            onClick={handleBuscar}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
          {busqueda && (
            <button
              onClick={handleLimpiarBusqueda}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista de tratamientos */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando tratamientos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
        </div>
      ) : tratamientos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No se encontraron tratamientos</p>
          <p className="text-sm text-gray-500">
            {busqueda ? 'Intenta con otra búsqueda' : 'No hay tratamientos registrados'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Tratamiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Items de Consumo
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tratamientos.map((tratamiento) => (
                    <tr key={tratamiento._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tratamiento.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-mono">
                          {tratamiento.codigo || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          ${tratamiento.precio.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {tratamiento.totalConsumos || tratamiento.consumos?.length || 0} items
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleEditarConsumos(tratamiento)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Gestionar Consumos</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(filtros.page || 1) * (filtros.limit || 20) - (filtros.limit || 20) + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min((filtros.page || 1) * (filtros.limit || 20), total)}
                </span>{' '}
                de <span className="font-medium">{total}</span> tratamientos
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCambiarPagina((filtros.page || 1) - 1)}
                  disabled={(filtros.page || 1) === 1}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handleCambiarPagina((filtros.page || 1) + 1)}
                  disabled={(filtros.page || 1) >= totalPages}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de edición */}
      {mostrarModal && tratamientoSeleccionado && (
        <ModalEditarConsumos
          tratamiento={tratamientoSeleccionado}
          onClose={handleCerrarModal}
          onGuardado={handleGuardado}
        />
      )}
    </div>
  );
}

