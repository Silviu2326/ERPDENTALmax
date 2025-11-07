import { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, Search, Filter, AlertCircle, BarChart3, ShoppingCart, ChevronDown, ChevronUp, X, Loader2 } from 'lucide-react';
import {
  obtenerOrdenesCompra,
  cambiarEstadoOrdenCompra,
  eliminarOrdenCompra,
  OrdenCompra,
  FiltrosOrdenesCompra,
} from '../api/ordenesCompraApi';
import TablaOrdenesCompra from '../components/TablaOrdenesCompra';
import FormularioCrearOrdenCompra from '../components/FormularioCrearOrdenCompra';
import { crearOrdenCompra } from '../api/ordenesCompraApi';
import MetricCards from '../components/MetricCards';

interface OrdenesCompraPageProps {
  onVerDetalle?: (ordenId: string) => void;
  onNuevaOrden?: () => void;
}

export default function OrdenesCompraPage({
  onVerDetalle,
  onNuevaOrden,
}: OrdenesCompraPageProps = {}) {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosOrdenesCompra>({
    page: 1,
    limit: 20,
  });
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [todasLasOrdenes, setTodasLasOrdenes] = useState<OrdenCompra[]>([]);

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const totalOrdenes = todasLasOrdenes.length;
    const valorTotal = todasLasOrdenes.reduce((sum, o) => sum + o.total, 0);
    const ordenesPendientes = todasLasOrdenes.filter(
      (o) => o.estado === 'Enviada' || o.estado === 'Borrador'
    ).length;
    const ordenesCompletadas = todasLasOrdenes.filter(
      (o) => o.estado === 'Recibida Completa'
    ).length;
    const ordenesPorEstado = {
      Borrador: todasLasOrdenes.filter((o) => o.estado === 'Borrador').length,
      Enviada: todasLasOrdenes.filter((o) => o.estado === 'Enviada').length,
      'Recibida Parcial': todasLasOrdenes.filter((o) => o.estado === 'Recibida Parcial').length,
      'Recibida Completa': todasLasOrdenes.filter((o) => o.estado === 'Recibida Completa').length,
      Cancelada: todasLasOrdenes.filter((o) => o.estado === 'Cancelada').length,
    };

    return {
      totalOrdenes,
      valorTotal,
      ordenesPendientes,
      ordenesCompletadas,
      ordenesPorEstado,
    };
  }, [todasLasOrdenes]);

  // Estados para filtros
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  const [proveedorFiltro, setProveedorFiltro] = useState<string>('');
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState<string>('');
  const [fechaFinFiltro, setFechaFinFiltro] = useState<string>('');
  const [sucursalFiltro, setSucursalFiltro] = useState<string>('');

  // Datos mock para filtros (en producción vendrían de APIs)
  const estados = [
    { value: '', label: 'Todos los estados' },
    { value: 'Borrador', label: 'Borrador' },
    { value: 'Enviada', label: 'Enviada' },
    { value: 'Recibida Parcial', label: 'Recibida Parcial' },
    { value: 'Recibida Completa', label: 'Recibida Completa' },
    { value: 'Cancelada', label: 'Cancelada' },
  ];

  const sucursales = [
    { _id: '', nombre: 'Todas las sucursales' },
    { _id: '1', nombre: 'Sede Central' },
    { _id: '2', nombre: 'Sede Norte' },
    { _id: '3', nombre: 'Sede Sur' },
  ];

  useEffect(() => {
    cargarOrdenes();
  }, [filtros]);

  const cargarOrdenes = async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await obtenerOrdenesCompra(filtros);
      setOrdenes(respuesta.ordenes);
      setTotalPaginas(respuesta.paginas);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las órdenes de compra');
      // Datos falsos completos - NO usar API
      const ordenesMock: OrdenCompra[] = [
        {
          _id: '1',
          numeroOrden: 'OC-2024-001',
          proveedor: {
            _id: '1',
            nombreComercial: 'Proveedor Dental S.A.',
            razonSocial: 'Proveedor Dental Sociedad Anónima',
            nif: 'B12345678',
            contacto: {
              nombre: 'Juan García',
              email: 'contacto@proveedordental.com',
              telefono: '912345678',
            },
            direccion: {
              calle: 'Calle Mayor 123',
              ciudad: 'Madrid',
              codigoPostal: '28001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '1',
              descripcion: 'Composite Resina A2',
              cantidad: 10,
              precioUnitario: 25.50,
              subtotal: 255.0,
            },
            {
              producto: '2',
              descripcion: 'Anestesia Lidocaína 2%',
              cantidad: 5,
              precioUnitario: 15.75,
              subtotal: 78.75,
            },
          ],
          subtotal: 333.75,
          impuestos: 70.09,
          total: 403.84,
          estado: 'Enviada',
          creadoPor: { _id: '1', nombre: 'María López' },
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
          ],
        },
        {
          _id: '2',
          numeroOrden: 'OC-2024-002',
          proveedor: {
            _id: '2',
            nombreComercial: 'Farmacéutica Dental',
            razonSocial: 'Farmacéutica Dental S.L.',
            nif: 'B87654321',
            contacto: {
              nombre: 'Ana Martínez',
              email: 'ventas@farmaceuticadental.com',
              telefono: '923456789',
            },
            direccion: {
              calle: 'Avenida de la Salud 45',
              ciudad: 'Barcelona',
              codigoPostal: '08001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '3',
              descripcion: 'Gel Desinfectante Clorhexidina',
              cantidad: 20,
              precioUnitario: 9.80,
              subtotal: 196.0,
            },
            {
              producto: '4',
              descripcion: 'Cemento de Ionómero de Vidrio',
              cantidad: 15,
              precioUnitario: 18.90,
              subtotal: 283.5,
            },
          ],
          subtotal: 479.5,
          impuestos: 100.70,
          total: 580.20,
          estado: 'Recibida Completa',
          creadoPor: { _id: '2', nombre: 'Carlos Ruiz' },
          notas: 'Entregado en perfecto estado. Verificar caducidades.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
            { estado: 'Recibida Completa', fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
          ],
        },
        {
          _id: '3',
          numeroOrden: 'OC-2024-003',
          proveedor: {
            _id: '3',
            nombreComercial: 'Suministros Médicos',
            razonSocial: 'Suministros Médicos S.A.',
            nif: 'A11223344',
            contacto: {
              nombre: 'Pedro Sánchez',
              email: 'pedro@suministrosmedicos.com',
              telefono: '934567890',
            },
            direccion: {
              calle: 'Calle Industria 78',
              ciudad: 'Valencia',
              codigoPostal: '46001',
            },
          },
          sucursal: { _id: '2', nombre: 'Sede Norte' },
          fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '5',
              descripcion: 'Guantes de Nitrilo Talla M',
              cantidad: 50,
              precioUnitario: 15.00,
              subtotal: 750.0,
            },
            {
              producto: '6',
              descripcion: 'Agujas Desechables 27G',
              cantidad: 10,
              precioUnitario: 22.50,
              subtotal: 225.0,
            },
            {
              producto: '7',
              descripcion: 'Mascarillas Quirúrgicas N95',
              cantidad: 30,
              precioUnitario: 28.50,
              subtotal: 855.0,
            },
          ],
          subtotal: 1830.0,
          impuestos: 384.30,
          total: 2214.30,
          estado: 'Borrador',
          creadoPor: { _id: '3', nombre: 'Laura Fernández' },
          notas: 'Revisar disponibilidad antes de enviar.',
        },
        {
          _id: '4',
          numeroOrden: 'OC-2024-004',
          proveedor: {
            _id: '1',
            nombreComercial: 'Proveedor Dental S.A.',
            razonSocial: 'Proveedor Dental Sociedad Anónima',
            nif: 'B12345678',
            contacto: {
              nombre: 'Juan García',
              email: 'contacto@proveedordental.com',
              telefono: '912345678',
            },
            direccion: {
              calle: 'Calle Mayor 123',
              ciudad: 'Madrid',
              codigoPostal: '28001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '8',
              descripcion: 'Implante Dental Titanio',
              cantidad: 3,
              precioUnitario: 250.00,
              subtotal: 750.0,
            },
          ],
          subtotal: 750.0,
          impuestos: 157.50,
          total: 907.50,
          estado: 'Recibida Parcial',
          creadoPor: { _id: '1', nombre: 'María López' },
          notas: 'Falta 1 unidad de implante. Pendiente de entrega.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
            { estado: 'Recibida Parcial', fecha: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
          ],
        },
        {
          _id: '5',
          numeroOrden: 'OC-2024-005',
          proveedor: {
            _id: '4',
            nombreComercial: 'Tecnología Dental',
            razonSocial: 'Tecnología Dental S.L.',
            nif: 'B99887766',
            contacto: {
              nombre: 'Miguel Torres',
              email: 'miguel@tecnologiadental.com',
              telefono: '945678901',
            },
            direccion: {
              calle: 'Polígono Industrial Norte, Nave 12',
              ciudad: 'Sevilla',
              codigoPostal: '41001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '9',
              descripcion: 'Lámpara de Polimerización LED',
              cantidad: 2,
              precioUnitario: 320.00,
              subtotal: 640.0,
            },
            {
              producto: '10',
              descripcion: 'Radiografía Digital Sensor',
              cantidad: 1,
              precioUnitario: 1250.00,
              subtotal: 1250.0,
            },
          ],
          subtotal: 1890.0,
          impuestos: 396.90,
          total: 2286.90,
          estado: 'Cancelada',
          creadoPor: { _id: '2', nombre: 'Carlos Ruiz' },
          notas: 'Cancelada por cambio de especificaciones técnicas.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
            { estado: 'Cancelada', fecha: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
          ],
        },
        {
          _id: '6',
          numeroOrden: 'OC-2024-006',
          proveedor: {
            _id: '2',
            nombreComercial: 'Farmacéutica Dental',
            razonSocial: 'Farmacéutica Dental S.L.',
            nif: 'B87654321',
            contacto: {
              nombre: 'Ana Martínez',
              email: 'ventas@farmaceuticadental.com',
              telefono: '923456789',
            },
            direccion: {
              calle: 'Avenida de la Salud 45',
              ciudad: 'Barcelona',
              codigoPostal: '08001',
            },
          },
          sucursal: { _id: '2', nombre: 'Sede Norte' },
          fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '11',
              descripcion: 'Anestésico Articaina 4%',
              cantidad: 25,
              precioUnitario: 9.50,
              subtotal: 237.50,
            },
            {
              producto: '12',
              descripcion: 'Anestésico Mepivacaína 3%',
              cantidad: 15,
              precioUnitario: 9.25,
              subtotal: 138.75,
            },
            {
              producto: '13',
              descripcion: 'Gel Desinfectante Clorhexidina',
              cantidad: 30,
              precioUnitario: 9.80,
              subtotal: 294.00,
            },
          ],
          subtotal: 670.25,
          impuestos: 140.75,
          total: 811.00,
          estado: 'Enviada',
          creadoPor: { _id: '3', nombre: 'Laura Fernández' },
          notas: 'Urgente - Necesario para próxima semana.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Laura Fernández' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Laura Fernández' },
          ],
        },
        {
          _id: '7',
          numeroOrden: 'OC-2024-007',
          proveedor: {
            _id: '3',
            nombreComercial: 'Suministros Médicos',
            razonSocial: 'Suministros Médicos S.A.',
            nif: 'A11223344',
            contacto: {
              nombre: 'Pedro Sánchez',
              email: 'pedro@suministrosmedicos.com',
              telefono: '934567890',
            },
            direccion: {
              calle: 'Calle Industria 78',
              ciudad: 'Valencia',
              codigoPostal: '46001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '14',
              descripcion: 'Guantes de Nitrilo Talla M',
              cantidad: 100,
              precioUnitario: 15.00,
              subtotal: 1500.00,
            },
            {
              producto: '15',
              descripcion: 'Guantes de Nitrilo Talla L',
              cantidad: 80,
              precioUnitario: 15.50,
              subtotal: 1240.00,
            },
            {
              producto: '16',
              descripcion: 'Guantes de Nitrilo Talla S',
              cantidad: 60,
              precioUnitario: 15.00,
              subtotal: 900.00,
            },
            {
              producto: '17',
              descripcion: 'Agujas Desechables 27G',
              cantidad: 20,
              precioUnitario: 22.50,
              subtotal: 450.00,
            },
            {
              producto: '18',
              descripcion: 'Agujas Desechables 30G',
              cantidad: 15,
              precioUnitario: 24.00,
              subtotal: 360.00,
            },
          ],
          subtotal: 4450.00,
          impuestos: 934.50,
          total: 5384.50,
          estado: 'Recibida Completa',
          creadoPor: { _id: '1', nombre: 'María López' },
          notas: 'Entregado completo. Verificar lotes y caducidades.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
            { estado: 'Recibida Completa', fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
          ],
        },
        {
          _id: '8',
          numeroOrden: 'OC-2024-008',
          proveedor: {
            _id: '1',
            nombreComercial: 'Proveedor Dental S.A.',
            razonSocial: 'Proveedor Dental Sociedad Anónima',
            nif: 'B12345678',
            contacto: {
              nombre: 'Juan García',
              email: 'contacto@proveedordental.com',
              telefono: '912345678',
            },
            direccion: {
              calle: 'Calle Mayor 123',
              ciudad: 'Madrid',
              codigoPostal: '28001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '19',
              descripcion: 'Resina Composite A2',
              cantidad: 20,
              precioUnitario: 12.50,
              subtotal: 250.00,
            },
            {
              producto: '20',
              descripcion: 'Resina Composite B1',
              cantidad: 15,
              precioUnitario: 13.20,
              subtotal: 198.00,
            },
            {
              producto: '21',
              descripcion: 'Resina Composite D3',
              cantidad: 12,
              precioUnitario: 12.80,
              subtotal: 153.60,
            },
          ],
          subtotal: 601.60,
          impuestos: 126.34,
          total: 727.94,
          estado: 'Recibida Parcial',
          creadoPor: { _id: '2', nombre: 'Carlos Ruiz' },
          notas: 'Faltan 3 unidades de Resina Composite A2. Pendiente de entrega.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
            { estado: 'Recibida Parcial', fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
          ],
        },
        {
          _id: '9',
          numeroOrden: 'OC-2024-009',
          proveedor: {
            _id: '1',
            nombreComercial: 'Proveedor Dental S.A.',
            razonSocial: 'Proveedor Dental Sociedad Anónima',
            nif: 'B12345678',
            contacto: {
              nombre: 'Juan García',
              email: 'contacto@proveedordental.com',
              telefono: '912345678',
            },
            direccion: {
              calle: 'Calle Mayor 123',
              ciudad: 'Madrid',
              codigoPostal: '28001',
            },
          },
          sucursal: { _id: '3', nombre: 'Sede Sur' },
          fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '22',
              descripcion: 'Implante Dental Titanio',
              cantidad: 8,
              precioUnitario: 250.00,
              subtotal: 2000.00,
            },
            {
              producto: '23',
              descripcion: 'Implante Dental Zirconio',
              cantidad: 5,
              precioUnitario: 320.00,
              subtotal: 1600.00,
            },
            {
              producto: '24',
              descripcion: 'Pilar de Cicatrización',
              cantidad: 12,
              precioUnitario: 45.00,
              subtotal: 540.00,
            },
          ],
          subtotal: 4140.00,
          impuestos: 869.40,
          total: 5009.40,
          estado: 'Borrador',
          creadoPor: { _id: '3', nombre: 'Laura Fernández' },
          notas: 'Revisar disponibilidad de implantes antes de enviar.',
        },
        {
          _id: '10',
          numeroOrden: 'OC-2024-010',
          proveedor: {
            _id: '4',
            nombreComercial: 'Tecnología Dental',
            razonSocial: 'Tecnología Dental S.L.',
            nif: 'B99887766',
            contacto: {
              nombre: 'Miguel Torres',
              email: 'miguel@tecnologiadental.com',
              telefono: '945678901',
            },
            direccion: {
              calle: 'Polígono Industrial Norte, Nave 12',
              ciudad: 'Sevilla',
              codigoPostal: '41001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '25',
              descripcion: 'Radiografía Digital Sensor',
              cantidad: 2,
              precioUnitario: 1250.00,
              subtotal: 2500.00,
            },
            {
              producto: '26',
              descripcion: 'Lámpara de Polimerización LED',
              cantidad: 3,
              precioUnitario: 320.00,
              subtotal: 960.00,
            },
          ],
          subtotal: 3460.00,
          impuestos: 726.60,
          total: 4186.60,
          estado: 'Recibida Completa',
          creadoPor: { _id: '1', nombre: 'María López' },
          notas: 'Equipamiento instalado y funcionando correctamente.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
            { estado: 'Recibida Completa', fecha: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
          ],
        },
        {
          _id: '11',
          numeroOrden: 'OC-2024-011',
          proveedor: {
            _id: '2',
            nombreComercial: 'Farmacéutica Dental',
            razonSocial: 'Farmacéutica Dental S.L.',
            nif: 'B87654321',
            contacto: {
              nombre: 'Ana Martínez',
              email: 'ventas@farmaceuticadental.com',
              telefono: '923456789',
            },
            direccion: {
              calle: 'Avenida de la Salud 45',
              ciudad: 'Barcelona',
              codigoPostal: '08001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '27',
              descripcion: 'Resina Flow',
              cantidad: 8,
              precioUnitario: 28.50,
              subtotal: 228.00,
            },
            {
              producto: '28',
              descripcion: 'Cemento de Resina',
              cantidad: 6,
              precioUnitario: 35.80,
              subtotal: 214.80,
            },
            {
              producto: '29',
              descripcion: 'Gel Anestésico Tópico',
              cantidad: 15,
              precioUnitario: 6.50,
              subtotal: 97.50,
            },
          ],
          subtotal: 540.30,
          impuestos: 113.46,
          total: 653.76,
          estado: 'Enviada',
          creadoPor: { _id: '2', nombre: 'Carlos Ruiz' },
          notas: 'Materiales para restauraciones y procedimientos de rutina.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
          ],
        },
        {
          _id: '12',
          numeroOrden: 'OC-2024-012',
          proveedor: {
            _id: '1',
            nombreComercial: 'Proveedor Dental S.A.',
            razonSocial: 'Proveedor Dental Sociedad Anónima',
            nif: 'B12345678',
            contacto: {
              nombre: 'Juan García',
              email: 'contacto@proveedordental.com',
              telefono: '912345678',
            },
            direccion: {
              calle: 'Calle Mayor 123',
              ciudad: 'Madrid',
              codigoPostal: '28001',
            },
          },
          sucursal: { _id: '2', nombre: 'Sede Norte' },
          fechaCreacion: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '30',
              descripcion: 'Brackets Linguales',
              cantidad: 2,
              precioUnitario: 380.00,
              subtotal: 760.00,
            },
            {
              producto: '31',
              descripcion: 'Fresas de Diamante Estándar',
              cantidad: 4,
              precioUnitario: 75.00,
              subtotal: 300.00,
            },
          ],
          subtotal: 1060.00,
          impuestos: 222.60,
          total: 1282.60,
          estado: 'Recibida Parcial',
          creadoPor: { _id: '3', nombre: 'Laura Fernández' },
          notas: 'Falta 1 juego de brackets. Pendiente de entrega.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Laura Fernández' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Laura Fernández' },
            { estado: 'Recibida Parcial', fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Laura Fernández' },
          ],
        },
        {
          _id: '13',
          numeroOrden: 'OC-2024-013',
          proveedor: {
            _id: '3',
            nombreComercial: 'Suministros Médicos',
            razonSocial: 'Suministros Médicos S.A.',
            nif: 'A11223344',
            contacto: {
              nombre: 'Pedro Sánchez',
              email: 'pedro@suministrosmedicos.com',
              telefono: '934567890',
            },
            direccion: {
              calle: 'Calle Industria 78',
              ciudad: 'Valencia',
              codigoPostal: '46001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '32',
              descripcion: 'Guantes de Nitrilo Talla M',
              cantidad: 80,
              precioUnitario: 15.00,
              subtotal: 1200.00,
            },
            {
              producto: '33',
              descripcion: 'Guantes de Nitrilo Talla L',
              cantidad: 60,
              precioUnitario: 15.50,
              subtotal: 930.00,
            },
            {
              producto: '34',
              descripcion: 'Guantes de Nitrilo Talla S',
              cantidad: 40,
              precioUnitario: 15.00,
              subtotal: 600.00,
            },
            {
              producto: '35',
              descripcion: 'Hilo Retractor',
              cantidad: 20,
              precioUnitario: 18.75,
              subtotal: 375.00,
            },
          ],
          subtotal: 3105.00,
          impuestos: 652.05,
          total: 3757.05,
          estado: 'Recibida Completa',
          creadoPor: { _id: '1', nombre: 'María López' },
          notas: 'Entregado completo. Verificar tallas y distribuir por consultorios.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
            { estado: 'Recibida Completa', fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'María López' },
          ],
        },
        {
          _id: '14',
          numeroOrden: 'OC-2024-014',
          proveedor: {
            _id: '1',
            nombreComercial: 'Proveedor Dental S.A.',
            razonSocial: 'Proveedor Dental Sociedad Anónima',
            nif: 'B12345678',
            contacto: {
              nombre: 'Juan García',
              email: 'contacto@proveedordental.com',
              telefono: '912345678',
            },
            direccion: {
              calle: 'Calle Mayor 123',
              ciudad: 'Madrid',
              codigoPostal: '28001',
            },
          },
          sucursal: { _id: '3', nombre: 'Sede Sur' },
          fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '36',
              descripcion: 'Implante Dental Mini',
              cantidad: 5,
              precioUnitario: 195.00,
              subtotal: 975.00,
            },
            {
              producto: '37',
              descripcion: 'Pilar de Cicatrización',
              cantidad: 8,
              precioUnitario: 45.00,
              subtotal: 360.00,
            },
          ],
          subtotal: 1335.00,
          impuestos: 280.35,
          total: 1615.35,
          estado: 'Borrador',
          creadoPor: { _id: '3', nombre: 'Laura Fernández' },
          notas: 'Revisar disponibilidad antes de enviar.',
        },
        {
          _id: '15',
          numeroOrden: 'OC-2024-015',
          proveedor: {
            _id: '2',
            nombreComercial: 'Farmacéutica Dental',
            razonSocial: 'Farmacéutica Dental S.L.',
            nif: 'B87654321',
            contacto: {
              nombre: 'Ana Martínez',
              email: 'ventas@farmaceuticadental.com',
              telefono: '923456789',
            },
            direccion: {
              calle: 'Avenida de la Salud 45',
              ciudad: 'Barcelona',
              codigoPostal: '08001',
            },
          },
          sucursal: { _id: '1', nombre: 'Sede Central' },
          fechaCreacion: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          fechaEntregaEstimada: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              producto: '38',
              descripcion: 'Anestésico Prilocaína 4%',
              cantidad: 20,
              precioUnitario: 9.90,
              subtotal: 198.00,
            },
            {
              producto: '39',
              descripcion: 'Cemento de Policarboxilato',
              cantidad: 10,
              precioUnitario: 19.50,
              subtotal: 195.00,
            },
          ],
          subtotal: 393.00,
          impuestos: 82.53,
          total: 475.53,
          estado: 'Recibida Completa',
          creadoPor: { _id: '2', nombre: 'Carlos Ruiz' },
          notas: 'Entregado completo. Verificar caducidades.',
          historialEstados: [
            { estado: 'Borrador', fecha: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
            { estado: 'Enviada', fecha: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
            { estado: 'Recibida Completa', fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), usuario: 'Carlos Ruiz' },
          ],
        },
      ];

      // Aplicar filtros
      let ordenesFiltradas = [...ordenesMock];

      if (filtros.estado) {
        ordenesFiltradas = ordenesFiltradas.filter((o) => o.estado === filtros.estado);
      }

      if (filtros.proveedorId) {
        ordenesFiltradas = ordenesFiltradas.filter((o) => {
          const prov = typeof o.proveedor === 'object' ? o.proveedor._id : o.proveedor;
          return prov === filtros.proveedorId;
        });
      }

      if (filtros.sucursalId) {
        ordenesFiltradas = ordenesFiltradas.filter((o) => {
          const suc = typeof o.sucursal === 'object' ? o.sucursal._id : o.sucursal;
          return suc === filtros.sucursalId;
        });
      }

      if (filtros.fechaInicio) {
        ordenesFiltradas = ordenesFiltradas.filter((o) => o.fechaCreacion >= filtros.fechaInicio!);
      }

      if (filtros.fechaFin) {
        ordenesFiltradas = ordenesFiltradas.filter((o) => o.fechaCreacion <= filtros.fechaFin!);
      }

      // Paginación
      const limit = filtros.limit || 20;
      const page = filtros.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      setOrdenes(ordenesFiltradas.slice(startIndex, endIndex));
      setTodasLasOrdenes(ordenesFiltradas);
      setTotalPaginas(Math.ceil(ordenesFiltradas.length / limit));
    } finally {
      setLoading(false);
    }
  };

  const handleCrearOrden = async (data: any) => {
    try {
      await crearOrdenCompra(data);
      setMostrarFormulario(false);
      cargarOrdenes();
    } catch (err: any) {
      throw err;
    }
  };

  const handleCambiarEstado = async (ordenId: string, nuevoEstado: OrdenCompra['estado']) => {
    try {
      await cambiarEstadoOrdenCompra(ordenId, nuevoEstado as any);
      cargarOrdenes();
    } catch (err: any) {
      alert(err.message || 'Error al cambiar el estado de la orden');
    }
  };

  const handleEliminar = async (ordenId: string) => {
    try {
      await eliminarOrdenCompra(ordenId);
      cargarOrdenes();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar la orden');
    }
  };

  const aplicarFiltros = () => {
    const nuevosFiltros: FiltrosOrdenesCompra = {
      page: 1,
      limit: 20,
    };
    if (estadoFiltro) nuevosFiltros.estado = estadoFiltro;
    if (proveedorFiltro) nuevosFiltros.proveedorId = proveedorFiltro;
    if (fechaInicioFiltro) nuevosFiltros.fechaInicio = fechaInicioFiltro;
    if (fechaFinFiltro) nuevosFiltros.fechaFin = fechaFinFiltro;
    if (sucursalFiltro) nuevosFiltros.sucursalId = sucursalFiltro;
    setFiltros(nuevosFiltros);
    setMostrarFiltros(false);
  };

  const limpiarFiltros = () => {
    setEstadoFiltro('');
    setProveedorFiltro('');
    setFechaInicioFiltro('');
    setFechaFinFiltro('');
    setSucursalFiltro('');
    setFiltros({ page: 1, limit: 20 });
    setMostrarFiltros(false);
  };

  if (mostrarFormulario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <FormularioCrearOrdenCompra
            onSubmit={handleCrearOrden}
            onCancel={() => setMostrarFormulario(false)}
          />
        </div>
      </div>
    );
  }

  const filtrosActivos = [
    estadoFiltro && 'Estado',
    sucursalFiltro && 'Sucursal',
    fechaInicioFiltro && 'Fecha Inicio',
    fechaFinFiltro && 'Fecha Fin',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ShoppingCart size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Órdenes de Compra
                  </h1>
                  <p className="text-gray-600">
                    Gestiona las órdenes de compra a proveedores
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setMostrarFormulario(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus size={20} />
              Nueva Orden
            </button>
          </div>

          {/* Sistema de Filtros */}
          <div className="bg-white shadow-sm rounded-lg p-0">
            <div className="p-4">
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  {/* Input de búsqueda */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Buscar órdenes de compra..."
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 text-sm"
                    />
                  </div>
                  
                  {/* Botón de filtros */}
                  <button
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    <Filter size={18} />
                    Filtros
                    {filtrosActivos > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                        {filtrosActivos}
                      </span>
                    )}
                    {mostrarFiltros ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  
                  {/* Botón limpiar (si hay filtros activos) */}
                  {filtrosActivos > 0 && (
                    <button
                      onClick={limpiarFiltros}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-colors text-sm font-medium"
                    >
                      <X size={18} />
                      Limpiar
                    </button>
                  )}
                  
                  {/* Botón actualizar */}
                  <button
                    onClick={cargarOrdenes}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    <RefreshCw size={18} />
                    Actualizar
                  </button>
                </div>
              </div>
            </div>

            {/* Panel de Filtros Avanzados */}
            {mostrarFiltros && (
              <div className="px-4 pb-4">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Filter size={16} className="inline mr-1" />
                        Estado
                      </label>
                      <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                      >
                        {estados.map((estado) => (
                          <option key={estado.value} value={estado.value}>
                            {estado.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Package size={16} className="inline mr-1" />
                        Sucursal
                      </label>
                      <select
                        value={sucursalFiltro}
                        onChange={(e) => setSucursalFiltro(e.target.value)}
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                      >
                        {sucursales.map((sucursal) => (
                          <option key={sucursal._id} value={sucursal._id}>
                            {sucursal.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fecha Inicio
                      </label>
                      <input
                        type="date"
                        value={fechaInicioFiltro}
                        onChange={(e) => setFechaInicioFiltro(e.target.value)}
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fecha Fin
                      </label>
                      <input
                        type="date"
                        value={fechaFinFiltro}
                        onChange={(e) => setFechaFinFiltro(e.target.value)}
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={aplicarFiltros}
                        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Aplicar Filtros
                      </button>
                    </div>
                  </div>
                  
                  {/* Resumen de resultados */}
                  <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                    <span>{todasLasOrdenes.length} órdenes encontradas</span>
                    <span>{filtrosActivos} filtros aplicados</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KPIs/Métricas */}
          <MetricCards
            data={[
              {
                id: 'total-ordenes',
                title: 'Total Órdenes',
                value: estadisticas.totalOrdenes,
                color: 'info',
              },
              {
                id: 'valor-total',
                title: 'Valor Total',
                value: `€${estadisticas.valorTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
                color: 'success',
              },
              {
                id: 'pendientes',
                title: 'Pendientes',
                value: estadisticas.ordenesPendientes,
                color: 'warning',
              },
              {
                id: 'completadas',
                title: 'Completadas',
                value: estadisticas.ordenesCompletadas,
                color: 'success',
              },
            ]}
          />

          {/* Estadísticas adicionales por estado */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              Distribución por Estado
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(estadisticas.ordenesPorEstado).map(([estado, cantidad]) => {
                const porcentaje = estadisticas.totalOrdenes > 0 
                  ? (cantidad / estadisticas.totalOrdenes) * 100 
                  : 0;
                const colores: { [key: string]: string } = {
                  'Borrador': 'bg-gray-500',
                  'Enviada': 'bg-blue-500',
                  'Recibida Parcial': 'bg-yellow-500',
                  'Recibida Completa': 'bg-green-500',
                  'Cancelada': 'bg-red-500',
                };
                return (
                  <div key={estado} className="p-4 bg-gray-50 rounded-lg ring-1 ring-gray-200">
                    <p className="text-sm font-medium text-slate-700 mb-2 truncate">{estado}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">{cantidad}</span>
                        <span className="text-xs text-gray-500">{porcentaje.toFixed(1)}%</span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`${colores[estado] || 'bg-gray-500'} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-white shadow-sm rounded-lg p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={cargarOrdenes}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <RefreshCw size={18} />
                Reintentar
              </button>
            </div>
          )}

          {/* Tabla */}
          {!error && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <TablaOrdenesCompra
                ordenes={ordenes}
                loading={loading}
                onVerDetalle={(ordenId) => {
                  if (onVerDetalle) {
                    onVerDetalle(ordenId);
                  }
                }}
                onEditar={(ordenId) => {
                  // TODO: Implementar edición
                  console.log('Editar orden:', ordenId);
                }}
                onEliminar={handleEliminar}
                onCambiarEstado={handleCambiarEstado}
              />
            </div>
          )}

          {/* Paginación */}
          {!error && totalPaginas > 1 && (
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) - 1 })}
                  disabled={!filtros.page || filtros.page <= 1}
                  className="px-4 py-2 rounded-lg ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-slate-600">
                  Página {filtros.page || 1} de {totalPaginas}
                </span>
                <button
                  onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) + 1 })}
                  disabled={!filtros.page || filtros.page >= totalPaginas}
                  className="px-4 py-2 rounded-lg ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


