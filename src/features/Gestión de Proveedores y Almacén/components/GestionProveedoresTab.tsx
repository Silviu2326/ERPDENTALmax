import { useState, useEffect } from 'react';
import { Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Proveedor,
  FiltrosBusquedaProveedores as FiltrosBusquedaProveedoresType,
  NuevoProveedor,
} from '../api/proveedoresApi';
import FiltrosBusquedaProveedores from './FiltrosBusquedaProveedores';
import ProveedoresTable from './ProveedoresTable';
import ProveedorForm from './ProveedorForm';
import ModalDetalleProveedor from './ModalDetalleProveedor';
import MetricCards from './MetricCards';

export default function GestionProveedoresTab() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosBusquedaProveedoresType>({
    page: 1,
    limit: 20,
    estado: 'activo', // Por defecto mostrar solo activos
  });
  const [paginacion, setPaginacion] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | null>(null);
  const [proveedorDetalle, setProveedorDetalle] = useState<Proveedor | null>(null);
  const [guardando, setGuardando] = useState(false);

  // KPIs calculados en cliente con datos falsos
  const totalActivos = proveedores.filter((p) => (p.estado || (p.activo ? 'activo' : 'inactivo')) === 'activo').length;
  const totalInactivos = proveedores.length - totalActivos;
  const categoriasUnicas = Array.from(new Set(proveedores.flatMap((p) => p.categorias || [])));

  const exportarCSV = () => {
    const encabezados = [
      'ID',
      'Nombre Comercial',
      'Razón Social',
      'RFC/CIF',
      'Contacto',
      'Email',
      'Teléfono',
      'Ciudad',
      'Categorías',
      'Estado',
      'Creado'
    ];
    const filas = proveedores.map(p => [
      p._id || '',
      p.nombreComercial,
      p.razonSocial || '',
      p.rfc || p.cifnif || '',
      p.contactoPrincipal?.nombre || '',
      p.contactoPrincipal?.email || '',
      p.contactoPrincipal?.telefono || '',
      p.direccion?.ciudad || '',
      (p.categorias || []).join(' | '),
      p.estado || (p.activo ? 'activo' : 'inactivo'),
      p.createdAt || ''
    ]);
    const contenido = [encabezados, ...filas]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'proveedores.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const cargarProveedores = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos de proveedores - Ampliados
      const datosFalsos: Proveedor[] = [
        {
          _id: '1',
          nombreComercial: 'Dental Supplies Pro',
          razonSocial: 'Dental Supplies Pro S.L.',
          rfc: 'B12345678',
          cifnif: 'B12345678',
          direccion: {
            calle: 'Calle Gran Vía 45',
            ciudad: 'Madrid',
            codigoPostal: '28013',
            estado: 'Madrid',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Carlos Martínez',
            email: 'carlos.martinez@dentalsuppliespro.com',
            telefono: '+34 912 345 678',
          },
          contactosAdicionales: [
            {
              nombre: 'Ana García',
              email: 'ana.garcia@dentalsuppliespro.com',
              telefono: '+34 912 345 679',
            },
            {
              nombre: 'Luis Fernández',
              email: 'luis.fernandez@dentalsuppliespro.com',
              telefono: '+34 912 345 680',
            },
          ],
          informacionBancaria: {
            banco: 'Banco Santander',
            iban: 'ES91 2100 0418 4502 0005 1332',
          },
          categorias: ['Consumibles', 'Instrumental', 'Equipamiento'],
          notas: 'Proveedor principal de material odontológico. Plazo de entrega: 24-48h. Descuentos por volumen disponibles.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          _id: '2',
          nombreComercial: 'MedTech Solutions',
          razonSocial: 'MedTech Solutions S.A.',
          rfc: 'A87654321',
          cifnif: 'A87654321',
          direccion: {
            calle: 'Avenida Diagonal 123',
            ciudad: 'Barcelona',
            codigoPostal: '08008',
            estado: 'Barcelona',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Laura Fernández',
            email: 'laura.fernandez@medtech.es',
            telefono: '+34 934 567 890',
          },
          contactosAdicionales: [
            {
              nombre: 'Pablo Ruiz',
              email: 'pablo.ruiz@medtech.es',
              telefono: '+34 934 567 891',
            },
          ],
          informacionBancaria: {
            banco: 'CaixaBank',
            iban: 'ES12 2100 0813 6101 2345 6789',
          },
          categorias: ['Equipamiento', 'Consumibles'],
          notas: 'Especialistas en equipamiento médico de alta tecnología. Servicio técnico incluido.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-02-20T14:30:00Z',
        },
        {
          _id: '3',
          nombreComercial: 'Dental Care Plus',
          razonSocial: 'Dental Care Plus S.L.U.',
          rfc: 'B98765432',
          cifnif: 'B98765432',
          direccion: {
            calle: 'Calle Serrano 78',
            ciudad: 'Madrid',
            codigoPostal: '28006',
            estado: 'Madrid',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Miguel Rodríguez',
            email: 'miguel.rodriguez@dentalcareplus.com',
            telefono: '+34 915 678 901',
          },
          categorias: ['Consumibles', 'Oficina'],
          informacionBancaria: {
            banco: 'BBVA',
            iban: 'ES80 0182 1234 5678 9012 3456',
          },
          notas: 'Proveedor de confianza para material de oficina y consumibles básicos.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-03-10T09:15:00Z',
        },
        {
          _id: '4',
          nombreComercial: 'ProDental Equipment',
          razonSocial: 'ProDental Equipment S.L.',
          rfc: 'C11223344',
          cifnif: 'C11223344',
          direccion: {
            calle: 'Paseo de la Castellana 200',
            ciudad: 'Madrid',
            codigoPostal: '28046',
            estado: 'Madrid',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Sofía López',
            email: 'sofia.lopez@prodental.com',
            telefono: '+34 916 789 012',
          },
          contactosAdicionales: [
            {
              nombre: 'David Moreno',
              email: 'david.moreno@prodental.com',
              telefono: '+34 916 789 013',
            },
          ],
          informacionBancaria: {
            banco: 'Banco Sabadell',
            iban: 'ES03 0081 1234 5678 9012 3456',
          },
          categorias: ['Equipamiento', 'Instrumental'],
          notas: 'Fabricante directo de equipamiento dental. Precios competitivos y garantía extendida.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-01-25T11:45:00Z',
        },
        {
          _id: '5',
          nombreComercial: 'BioDental Materials',
          razonSocial: 'BioDental Materials S.A.',
          rfc: 'D55667788',
          cifnif: 'D55667788',
          direccion: {
            calle: 'Calle Colón 12',
            ciudad: 'Valencia',
            codigoPostal: '46004',
            estado: 'Valencia',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Javier Sánchez',
            email: 'javier.sanchez@biodental.es',
            telefono: '+34 963 456 789',
          },
          categorias: ['Consumibles'],
          informacionBancaria: {
            banco: 'Bankia',
            iban: 'ES64 2038 1234 5678 9012 3456',
          },
          notas: 'Especialistas en materiales biocompatibles y de última generación.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-02-05T16:20:00Z',
        },
        {
          _id: '6',
          nombreComercial: 'Dental Innovations',
          razonSocial: 'Dental Innovations S.L.',
          rfc: 'E99887766',
          cifnif: 'E99887766',
          direccion: {
            calle: 'Avenida de la Constitución 34',
            ciudad: 'Sevilla',
            codigoPostal: '41004',
            estado: 'Sevilla',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'María González',
            email: 'maria.gonzalez@dentalinnovations.com',
            telefono: '+34 954 123 456',
          },
          categorias: ['Instrumental', 'Equipamiento'],
          notas: 'Proveedor suspendido temporalmente por problemas de calidad.',
          estado: 'inactivo',
          activo: false,
          createdAt: '2023-12-10T10:00:00Z',
        },
        {
          _id: '7',
          nombreComercial: 'MaxiDental Supplies',
          razonSocial: 'MaxiDental Supplies S.L.',
          rfc: 'F44556677',
          cifnif: 'F44556677',
          direccion: {
            calle: 'Calle Mayor 56',
            ciudad: 'Bilbao',
            codigoPostal: '48001',
            estado: 'Vizcaya',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Roberto Pérez',
            email: 'roberto.perez@maxidental.com',
            telefono: '+34 944 567 890',
          },
          categorias: ['Consumibles', 'Oficina'],
          informacionBancaria: {
            banco: 'Kutxabank',
            iban: 'ES21 2095 1234 5678 9012 3456',
          },
          notas: 'Distribuidor regional del norte de España. Entrega rápida en 24h.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-03-15T13:30:00Z',
        },
        {
          _id: '8',
          nombreComercial: 'Premium Dental Tools',
          razonSocial: 'Premium Dental Tools S.A.',
          rfc: 'G33445566',
          cifnif: 'G33445566',
          direccion: {
            calle: 'Calle Alcalá 89',
            ciudad: 'Madrid',
            codigoPostal: '28009',
            estado: 'Madrid',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Elena Torres',
            email: 'elena.torres@premiumdental.com',
            telefono: '+34 917 890 123',
          },
          categorias: ['Instrumental'],
          informacionBancaria: {
            banco: 'ING Direct',
            iban: 'ES91 1465 1234 5678 9012 3456',
          },
          notas: 'Instrumental de precisión de alta calidad. Certificación ISO 13485.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-02-28T15:00:00Z',
        },
        {
          _id: '9',
          nombreComercial: 'LabDental Pro',
          razonSocial: 'LabDental Pro S.L.',
          rfc: 'H22334455',
          cifnif: 'H22334455',
          direccion: {
            calle: 'Calle Industria 15',
            ciudad: 'Zaragoza',
            codigoPostal: '50012',
            estado: 'Zaragoza',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Fernando Jiménez',
            email: 'fernando.jimenez@labdentalpro.com',
            telefono: '+34 976 123 456',
          },
          categorias: ['Consumibles', 'Equipamiento'],
          informacionBancaria: {
            banco: 'Ibercaja',
            iban: 'ES07 2085 1234 5678 9012 3456',
          },
          notas: 'Laboratorio dental especializado en prótesis y materiales de laboratorio.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-01-08T08:00:00Z',
        },
        {
          _id: '10',
          nombreComercial: 'SteriDent Solutions',
          razonSocial: 'SteriDent Solutions S.A.',
          rfc: 'I11223344',
          cifnif: 'I11223344',
          direccion: {
            calle: 'Polígono Industrial Sur, Nave 8',
            ciudad: 'Málaga',
            codigoPostal: '29006',
            estado: 'Málaga',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Carmen Ruiz',
            email: 'carmen.ruiz@steridentsolutions.com',
            telefono: '+34 952 234 567',
          },
          categorias: ['Consumibles'],
          informacionBancaria: {
            banco: 'Unicaja',
            iban: 'ES15 2103 1234 5678 9012 3456',
          },
          notas: 'Especialistas en productos de esterilización y desinfección.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-02-12T10:30:00Z',
        },
        {
          _id: '11',
          nombreComercial: 'Radiología Dental Avanzada',
          razonSocial: 'Radiología Dental Avanzada S.L.',
          rfc: 'J99887766',
          cifnif: 'J99887766',
          direccion: {
            calle: 'Avenida de la Ciencia 45',
            ciudad: 'Valencia',
            codigoPostal: '46010',
            estado: 'Valencia',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Antonio Vázquez',
            email: 'antonio.vazquez@radiodental.com',
            telefono: '+34 963 789 012',
          },
          categorias: ['Equipamiento'],
          informacionBancaria: {
            banco: 'Banco Popular',
            iban: 'ES25 0073 1234 5678 9012 3456',
          },
          notas: 'Equipos de radiología digital y software de diagnóstico.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-01-30T14:15:00Z',
        },
        {
          _id: '12',
          nombreComercial: 'OrthoMaterials',
          razonSocial: 'OrthoMaterials S.L.',
          rfc: 'K55667788',
          cifnif: 'K55667788',
          direccion: {
            calle: 'Calle Comercio 23',
            ciudad: 'Murcia',
            codigoPostal: '30001',
            estado: 'Murcia',
            pais: 'España',
          },
          contactoPrincipal: {
            nombre: 'Isabel Martínez',
            email: 'isabel.martinez@orthomaterials.com',
            telefono: '+34 968 345 678',
          },
          categorias: ['Consumibles', 'Instrumental'],
          informacionBancaria: {
            banco: 'Cajamar',
            iban: 'ES30 3058 1234 5678 9012 3456',
          },
          notas: 'Materiales especializados en ortodoncia y brackets.',
          estado: 'activo',
          activo: true,
          createdAt: '2024-03-05T11:20:00Z',
        },
      ];

      // Aplicar filtros
      let proveedoresFiltrados = [...datosFalsos];
      
      if (filtros.search) {
        const searchLower = filtros.search.toLowerCase();
        proveedoresFiltrados = proveedoresFiltrados.filter(p => 
          p.nombreComercial.toLowerCase().includes(searchLower) ||
          p.razonSocial?.toLowerCase().includes(searchLower) ||
          p.rfc?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filtros.estado) {
        proveedoresFiltrados = proveedoresFiltrados.filter(p => p.estado === filtros.estado);
      }
      
      if (filtros.categoria) {
        proveedoresFiltrados = proveedoresFiltrados.filter(p => 
          p.categorias?.includes(filtros.categoria!)
        );
      }

      // Paginación
      const page = filtros.page || 1;
      const limit = filtros.limit || 20;
      const total = proveedoresFiltrados.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const proveedoresPaginados = proveedoresFiltrados.slice(startIndex, endIndex);

      setProveedores(proveedoresPaginados);
      setPaginacion({
        total,
        page,
        limit,
        totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el listado de proveedores');
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProveedores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros]);

  const handleFiltrosChange = (nuevosFiltros: FiltrosBusquedaProveedoresType) => {
    setFiltros((prev) => ({
      ...prev,
      ...nuevosFiltros,
    }));
  };

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleNuevoProveedor = () => {
    setProveedorEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarProveedor = (proveedor: Proveedor) => {
    setProveedorEditando(proveedor);
    setMostrarFormulario(true);
  };

  const handleGuardarProveedor = async (datos: NuevoProveedor) => {
    setGuardando(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (proveedorEditando && proveedorEditando._id) {
        // Simular actualización
        console.log('Actualizando proveedor:', proveedorEditando._id, datos);
      } else {
        // Simular creación
        console.log('Creando nuevo proveedor:', datos);
      }
      
      setMostrarFormulario(false);
      setProveedorEditando(null);
      await cargarProveedores();
    } catch (err) {
      throw err; // Re-lanzar para que el formulario lo maneje
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setProveedorEditando(null);
  };

  const handleDesactivarProveedor = async (proveedorId: string) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simular desactivación
      console.log('Desactivando proveedor:', proveedorId);
      await cargarProveedores();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desactivar el proveedor');
    }
  };

  const handleVerDetalle = (proveedor: Proveedor) => {
    setProveedorDetalle(proveedor);
  };

  const handleCerrarDetalle = () => {
    setProveedorDetalle(null);
  };

  const handleEditarDesdeDetalle = () => {
    if (proveedorDetalle) {
      setProveedorEditando(proveedorDetalle);
      setProveedorDetalle(null);
      setMostrarFormulario(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleNuevoProveedor}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Proveedor
        </button>
      </div>

      {/* KPIs/Métricas */}
      <MetricCards
        data={[
          {
            id: 'activos',
            title: 'Activos',
            value: totalActivos,
            color: 'success',
          },
          {
            id: 'inactivos',
            title: 'Inactivos',
            value: totalInactivos,
            color: 'warning',
          },
          {
            id: 'categorias',
            title: 'Categorías cubiertas',
            value: categoriasUnicas.length,
            color: 'info',
          },
          {
            id: 'total',
            title: 'Total proveedores',
            value: paginacion.total,
            color: 'info',
          },
        ]}
      />

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Filtros de búsqueda */}
      <FiltrosBusquedaProveedores filtros={filtros} onFiltrosChange={handleFiltrosChange} />

      {/* Tabla de proveedores */}
      <ProveedoresTable
        proveedores={proveedores}
        loading={loading}
        onEditar={handleEditarProveedor}
        onVerDetalle={handleVerDetalle}
        onDesactivar={handleDesactivarProveedor}
      />

      {/* Paginación */}
      {paginacion.totalPages > 1 && (
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange((filtros.page || 1) - 1)}
              disabled={filtros.page === 1 || loading}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Página {filtros.page || 1} de {paginacion.totalPages}
            </span>
            <button
              onClick={() => handlePageChange((filtros.page || 1) + 1)}
              disabled={(filtros.page || 1) >= paginacion.totalPages || loading}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Mostrando {((filtros.page || 1) - 1) * (filtros.limit || 20) + 1} a{' '}
            {Math.min((filtros.page || 1) * (filtros.limit || 20), paginacion.total)} de{' '}
            {paginacion.total} proveedores
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <ProveedorForm
          proveedor={proveedorEditando || undefined}
          onGuardar={handleGuardarProveedor}
          onCancelar={handleCancelarFormulario}
          loading={guardando}
        />
      )}

      {/* Modal de detalle */}
      {proveedorDetalle && (
        <ModalDetalleProveedor
          proveedor={proveedorDetalle}
          onCerrar={handleCerrarDetalle}
          onEditar={handleEditarDesdeDetalle}
        />
      )}
    </div>
  );
}


