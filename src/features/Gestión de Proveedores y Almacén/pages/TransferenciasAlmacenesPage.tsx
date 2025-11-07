import { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, ArrowRightLeft, ChevronDown, ChevronUp, X } from 'lucide-react';
import TablaTransferencias from '../components/TablaTransferencias';
import FormularioNuevaTransferencia from '../components/FormularioNuevaTransferencia';
import ModalConfirmarRecepcion from '../components/ModalConfirmarRecepcion';
import {
  FiltrosTransferencias,
  TransferenciaAlmacen,
  NuevaTransferencia,
  EstadoTransferencia,
} from '../api/transferenciasApi';
import { Almacen } from '../api/almacenesApi';

interface TransferenciasAlmacenesPageProps {
  onVerDetalle?: (transferenciaId: string) => void;
}

export default function TransferenciasAlmacenesPage({
  onVerDetalle: onVerDetalleProp,
}: TransferenciasAlmacenesPageProps) {
  const [transferencias, setTransferencias] = useState<TransferenciaAlmacen[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [transferenciaAConfirmar, setTransferenciaAConfirmar] = useState<TransferenciaAlmacen | null>(null);
  const [filtros, setFiltros] = useState<FiltrosTransferencias>({
    page: 1,
    limit: 20,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransferencias, setTotalTransferencias] = useState(0);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarTransferencias();
    cargarAlmacenes();
  }, [filtros, busqueda]);

  const cargarTransferencias = async () => {
    setLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos de transferencias
      const datosFalsos: TransferenciaAlmacen[] = [
        {
          _id: '1',
          codigo: 'TRF-2024-001',
          almacenOrigen: {
            _id: '1',
            nombre: 'Almacén Principal',
            esPrincipal: true,
          },
          almacenDestino: {
            _id: '2',
            nombre: 'Almacén Sede Norte',
            esPrincipal: false,
          },
          estado: 'Pendiente',
          productos: [
            {
              producto: {
                _id: '1',
                nombre: 'Guantes de Nitrilo Desechables',
                sku: 'GNT-001',
                stockDisponible: 450,
              },
              cantidad: 50,
              lote: 'LOT-2024-001',
            },
            {
              producto: {
                _id: '2',
                nombre: 'Jeringas Desechables 5ml',
                sku: 'JNG-002',
                stockDisponible: 1200,
              },
              cantidad: 100,
            },
          ],
          usuarioSolicitante: {
            _id: '1',
            name: 'Juan Pérez',
            email: 'juan.perez@clinica.com',
          },
          fechaCreacion: '2024-03-15T10:30:00Z',
          notas: 'Transferencia urgente para reposición de stock',
        },
        {
          _id: '2',
          codigo: 'TRF-2024-002',
          almacenOrigen: {
            _id: '1',
            nombre: 'Almacén Principal',
            esPrincipal: true,
          },
          almacenDestino: {
            _id: '3',
            nombre: 'Almacén Sede Sur',
            esPrincipal: false,
          },
          estado: 'Completada',
          productos: [
            {
              producto: {
                _id: '3',
                nombre: 'Anestesia Local Lidocaína 2%',
                sku: 'ANT-003',
                stockDisponible: 85,
              },
              cantidad: 15,
              lote: 'LOT-2024-003',
            },
          ],
          usuarioSolicitante: {
            _id: '2',
            name: 'María López',
            email: 'maria.lopez@clinica.com',
          },
          usuarioReceptor: {
            _id: '3',
            name: 'Carlos Martínez',
            email: 'carlos.martinez@clinica.com',
          },
          fechaCreacion: '2024-03-10T14:00:00Z',
          fechaCompletado: '2024-03-11T09:15:00Z',
        },
        {
          _id: '3',
          codigo: 'TRF-2024-003',
          almacenOrigen: {
            _id: '2',
            nombre: 'Almacén Sede Norte',
            esPrincipal: false,
          },
          almacenDestino: {
            _id: '1',
            nombre: 'Almacén Principal',
            esPrincipal: true,
          },
          estado: 'Pendiente',
          productos: [
            {
              producto: {
                _id: '4',
                nombre: 'Fresas Dentales Carburo de Tungsteno',
                sku: 'FRD-004',
                stockDisponible: 35,
              },
              cantidad: 10,
            },
          ],
          usuarioSolicitante: {
            _id: '4',
            name: 'Ana García',
            email: 'ana.garcia@clinica.com',
          },
          fechaCreacion: '2024-03-14T11:20:00Z',
        },
        {
          _id: '4',
          codigo: 'TRF-2024-004',
          almacenOrigen: {
            _id: '4',
            nombre: 'Almacén Central de Suministros',
            esPrincipal: false,
          },
          almacenDestino: {
            _id: '1',
            nombre: 'Almacén Principal',
            esPrincipal: true,
          },
          estado: 'Completada',
          productos: [
            {
              producto: {
                _id: '8',
                nombre: 'Mascarillas Quirúrgicas FFP2',
                sku: 'MAS-008',
                stockDisponible: 320,
              },
              cantidad: 50,
              lote: 'LOT-2024-005',
            },
            {
              producto: {
                _id: '12',
                nombre: 'Algodón Estéril',
                sku: 'ALG-012',
                stockDisponible: 95,
              },
              cantidad: 20,
            },
          ],
          usuarioSolicitante: {
            _id: '5',
            name: 'Pedro Sánchez',
            email: 'pedro.sanchez@clinica.com',
          },
          usuarioReceptor: {
            _id: '1',
            name: 'Juan Pérez',
            email: 'juan.perez@clinica.com',
          },
          fechaCreacion: '2024-03-12T08:45:00Z',
          fechaCompletado: '2024-03-13T10:30:00Z',
        },
        {
          _id: '5',
          codigo: 'TRF-2024-005',
          almacenOrigen: {
            _id: '1',
            nombre: 'Almacén Principal',
            esPrincipal: true,
          },
          almacenDestino: {
            _id: '2',
            nombre: 'Almacén Sede Norte',
            esPrincipal: false,
          },
          estado: 'Cancelada',
          productos: [
            {
              producto: {
                _id: '5',
                nombre: 'Sillón Dental Eléctrico Premium',
                sku: 'SIL-005',
                stockDisponible: 3,
              },
              cantidad: 1,
            },
          ],
          usuarioSolicitante: {
            _id: '2',
            name: 'María López',
            email: 'maria.lopez@clinica.com',
          },
          fechaCreacion: '2024-03-08T16:00:00Z',
          notas: 'Cancelada por cambio de planificación',
        },
        {
          _id: '6',
          codigo: 'TRF-2024-006',
          almacenOrigen: {
            _id: '1',
            nombre: 'Almacén Principal',
            esPrincipal: true,
          },
          almacenDestino: {
            _id: '3',
            nombre: 'Almacén Sede Sur',
            esPrincipal: false,
          },
          estado: 'Pendiente',
          productos: [
            {
              producto: {
                _id: '13',
                nombre: 'Composite Resina Dental B2',
                sku: 'COM-013',
                stockDisponible: 120,
              },
              cantidad: 30,
              lote: 'LOT-2024-007',
            },
            {
              producto: {
                _id: '14',
                nombre: 'Gel Desinfectante Manos',
                sku: 'GEL-014',
                stockDisponible: 85,
              },
              cantidad: 20,
            },
          ],
          usuarioSolicitante: {
            _id: '3',
            name: 'Carlos Martínez',
            email: 'carlos.martinez@clinica.com',
          },
          fechaCreacion: '2024-03-16T09:00:00Z',
          notas: 'Transferencia para reposición de stock en sede sur',
        },
        {
          _id: '7',
          codigo: 'TRF-2024-007',
          almacenOrigen: {
            _id: '2',
            nombre: 'Almacén Sede Norte',
            esPrincipal: false,
          },
          almacenDestino: {
            _id: '1',
            nombre: 'Almacén Principal',
            esPrincipal: true,
          },
          estado: 'Completada',
          productos: [
            {
              producto: {
                _id: '15',
                nombre: 'Brackets Metálicos Estándar',
                sku: 'BRK-015',
                stockDisponible: 15,
              },
              cantidad: 5,
            },
          ],
          usuarioSolicitante: {
            _id: '4',
            name: 'Ana García',
            email: 'ana.garcia@clinica.com',
          },
          usuarioReceptor: {
            _id: '1',
            name: 'Juan Pérez',
            email: 'juan.perez@clinica.com',
          },
          fechaCreacion: '2024-03-12T11:30:00Z',
          fechaCompletado: '2024-03-13T08:45:00Z',
        },
        {
          _id: '8',
          codigo: 'TRF-2024-008',
          almacenOrigen: {
            _id: '4',
            nombre: 'Almacén Central de Suministros',
            esPrincipal: false,
          },
          almacenDestino: {
            _id: '2',
            nombre: 'Almacén Sede Norte',
            esPrincipal: false,
          },
          estado: 'Pendiente',
          productos: [
            {
              producto: {
                _id: '17',
                nombre: 'Solución Esterilizante Glutaraldehído',
                sku: 'EST-017',
                stockDisponible: 30,
              },
              cantidad: 10,
              lote: 'LOT-2024-009',
            },
            {
              producto: {
                _id: '20',
                nombre: 'Película Radiográfica Digital',
                sku: 'RAD-020',
                stockDisponible: 12,
              },
              cantidad: 3,
            },
          ],
          usuarioSolicitante: {
            _id: '5',
            name: 'Pedro Sánchez',
            email: 'pedro.sanchez@clinica.com',
          },
          fechaCreacion: '2024-03-17T14:20:00Z',
          notas: 'Material necesario para mantenimiento de equipos',
        },
        {
          _id: '9',
          codigo: 'TRF-2024-009',
          almacenOrigen: {
            _id: '1',
            nombre: 'Almacén Principal',
            esPrincipal: true,
          },
          almacenDestino: {
            _id: '4',
            nombre: 'Almacén Central de Suministros',
            esPrincipal: false,
          },
          estado: 'Completada',
          productos: [
            {
              producto: {
                _id: '18',
                nombre: 'Turbina Dental de Alta Velocidad',
                sku: 'TUR-018',
                stockDisponible: 6,
              },
              cantidad: 2,
            },
          ],
          usuarioSolicitante: {
            _id: '1',
            name: 'Juan Pérez',
            email: 'juan.perez@clinica.com',
          },
          usuarioReceptor: {
            _id: '4',
            name: 'Ana García',
            email: 'ana.garcia@clinica.com',
          },
          fechaCreacion: '2024-03-10T10:00:00Z',
          fechaCompletado: '2024-03-11T15:30:00Z',
          notas: 'Equipamiento para reparación en almacén central',
        },
        {
          _id: '10',
          codigo: 'TRF-2024-010',
          almacenOrigen: {
            _id: '3',
            nombre: 'Almacén Sede Sur',
            esPrincipal: false,
          },
          almacenDestino: {
            _id: '1',
            nombre: 'Almacén Principal',
            esPrincipal: true,
          },
          estado: 'Pendiente',
          productos: [
            {
              producto: {
                _id: '21',
                nombre: 'Cemento de Ionómero de Vidrio',
                sku: 'CEM-021',
                stockDisponible: 28,
              },
              cantidad: 8,
              lote: 'LOT-2024-011',
            },
            {
              producto: {
                _id: '22',
                nombre: 'Sellador de Fosas y Fisuras',
                sku: 'SEL-022',
                stockDisponible: 65,
              },
              cantidad: 15,
            },
          ],
          usuarioSolicitante: {
            _id: '3',
            name: 'Carlos Martínez',
            email: 'carlos.martinez@clinica.com',
          },
          fechaCreacion: '2024-03-18T08:15:00Z',
        },
      ];

      // Aplicar filtros
      let transferenciasFiltradas = [...datosFalsos];
      
      if (busqueda) {
        const searchLower = busqueda.toLowerCase();
        transferenciasFiltradas = transferenciasFiltradas.filter(t => 
          t.codigo.toLowerCase().includes(searchLower)
        );
      }
      
      if (filtros.estado) {
        transferenciasFiltradas = transferenciasFiltradas.filter(t => t.estado === filtros.estado);
      }
      
      if (filtros.origenId) {
        transferenciasFiltradas = transferenciasFiltradas.filter(t => 
          t.almacenOrigen._id === filtros.origenId
        );
      }
      
      if (filtros.destinoId) {
        transferenciasFiltradas = transferenciasFiltradas.filter(t => 
          t.almacenDestino._id === filtros.destinoId
        );
      }

      // Paginación
      const page = filtros.page || 1;
      const limit = filtros.limit || 20;
      const total = transferenciasFiltradas.length;
      const totalPagesCalculado = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const transferenciasPaginadas = transferenciasFiltradas.slice(startIndex, endIndex);

      setTransferencias(transferenciasPaginadas);
      setTotalPages(totalPagesCalculado);
      setTotalTransferencias(total);
    } catch (error) {
      console.error('Error al cargar transferencias:', error);
      setTransferencias([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarAlmacenes = async () => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Datos falsos de almacenes
      const almacenesData: Almacen[] = [
        {
          _id: '1',
          nombre: 'Almacén Principal',
          esPrincipal: true,
        },
        {
          _id: '2',
          nombre: 'Almacén Sede Norte',
          esPrincipal: false,
        },
        {
          _id: '3',
          nombre: 'Almacén Sede Sur',
          esPrincipal: false,
        },
        {
          _id: '4',
          nombre: 'Almacén Central de Suministros',
          esPrincipal: false,
        },
      ];
      
      setAlmacenes(almacenesData);
    } catch (error) {
      console.error('Error al cargar almacenes:', error);
      setAlmacenes([]);
    }
  };

  const handleNuevaTransferencia = async (nuevaTransferencia: NuevaTransferencia) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simular creación
      console.log('Creando transferencia:', nuevaTransferencia);
      setMostrarFormulario(false);
      cargarTransferencias();
    } catch (error: any) {
      throw error;
    }
  };

  const handleVerDetalle = (transferenciaId: string) => {
    if (onVerDetalleProp) {
      onVerDetalleProp(transferenciaId);
    }
  };

  const handleConfirmarRecepcion = async () => {
    if (!transferenciaAConfirmar?._id) return;

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simular confirmación
      console.log('Confirmando recepción de transferencia:', transferenciaAConfirmar._id);
      setTransferenciaAConfirmar(null);
      cargarTransferencias();
    } catch (error) {
      console.error('Error al confirmar recepción:', error);
      throw error;
    }
  };

  const handleCancelarTransferencia = async (transferenciaId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta transferencia?')) {
      return;
    }

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simular cancelación
      console.log('Cancelando transferencia:', transferenciaId);
      cargarTransferencias();
    } catch (error) {
      console.error('Error al cancelar transferencia:', error);
      alert('Error al cancelar la transferencia. Por favor, intenta de nuevo.');
    }
  };

  const handleAbrirModalConfirmar = async (transferenciaId: string) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Buscar la transferencia en los datos actuales
      const transferencia = transferencias.find(t => t._id === transferenciaId);
      if (transferencia) {
        setTransferenciaAConfirmar(transferencia);
      } else {
        throw new Error('Transferencia no encontrada');
      }
    } catch (error) {
      console.error('Error al obtener transferencia:', error);
      alert('Error al cargar los detalles de la transferencia.');
    }
  };

  const aplicarFiltros = () => {
    const nuevosFiltros: FiltrosTransferencias = {
      page: 1,
      limit: 20,
    };

    if (filtros.estado) nuevosFiltros.estado = filtros.estado;
    if (filtros.origenId) nuevosFiltros.origenId = filtros.origenId;
    if (filtros.destinoId) nuevosFiltros.destinoId = filtros.destinoId;
    if (filtros.fechaInicio) nuevosFiltros.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) nuevosFiltros.fechaFin = filtros.fechaFin;

    setFiltros(nuevosFiltros);
    setMostrarFiltros(false);
  };

  const limpiarFiltros = () => {
    setFiltros({
      page: 1,
      limit: 20,
    });
    setBusqueda('');
    setMostrarFiltros(false);
  };

  const filtrosActivos = 
    (filtros.estado ? 1 : 0) +
    (filtros.origenId ? 1 : 0) +
    (filtros.destinoId ? 1 : 0) +
    (filtros.fechaInicio ? 1 : 0) +
    (filtros.fechaFin ? 1 : 0);

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
                  <ArrowRightLeft size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Transferencias entre Almacenes
                  </h1>
                  <p className="text-gray-600">
                    Gestiona el movimiento de productos entre almacenes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm ring-1 ring-blue-600/20 font-medium"
              >
                <Plus size={20} />
                Nueva Transferencia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">

          {/* Filtros y Búsqueda */}
          <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200">
            <div className="space-y-4 p-4">
              {/* Barra de búsqueda */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  {/* Input de búsqueda */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar por código de transferencia..."
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                    />
                  </div>
                  
                  {/* Botón de filtros */}
                  <button
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 ring-1 ring-slate-200"
                  >
                    <Filter size={18} />
                    <span>Filtros</span>
                    {filtrosActivos > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                        {filtrosActivos}
                      </span>
                    )}
                    {mostrarFiltros ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  
                  {/* Botón limpiar (si hay filtros activos) */}
                  {filtrosActivos > 0 && (
                    <button
                      onClick={limpiarFiltros}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 ring-1 ring-slate-200"
                    >
                      <X size={18} />
                      <span>Limpiar</span>
                    </button>
                  )}
                  
                  {/* Botón actualizar */}
                  <button
                    onClick={cargarTransferencias}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-white/70 ring-1 ring-slate-200"
                  >
                    <RefreshCw size={18} />
                    <span>Actualizar</span>
                  </button>
                </div>
              </div>

              {/* Panel de filtros avanzados */}
              {mostrarFiltros && (
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Filter size={16} className="inline mr-1" />
                        Estado
                      </label>
                      <select
                        value={filtros.estado || ''}
                        onChange={(e) =>
                          setFiltros({ ...filtros, estado: e.target.value as EstadoTransferencia || undefined })
                        }
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      >
                        <option value="">Todos</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Completada">Completada</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Almacén Origen
                      </label>
                      <select
                        value={filtros.origenId || ''}
                        onChange={(e) => setFiltros({ ...filtros, origenId: e.target.value || undefined })}
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      >
                        <option value="">Todos</option>
                        {almacenes.map((almacen) => (
                          <option key={almacen._id} value={almacen._id}>
                            {almacen.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Almacén Destino
                      </label>
                      <select
                        value={filtros.destinoId || ''}
                        onChange={(e) => setFiltros({ ...filtros, destinoId: e.target.value || undefined })}
                        className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                      >
                        <option value="">Todos</option>
                        {almacenes.map((almacen) => (
                          <option key={almacen._id} value={almacen._id}>
                            {almacen.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Resumen de resultados */}
                  <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                    <span>{totalTransferencias} transferencias encontradas</span>
                    <span>{filtrosActivos} filtros aplicados</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabla de Transferencias */}
          <div className="bg-white shadow-sm rounded-xl ring-1 ring-slate-200 overflow-hidden">
            <TablaTransferencias
              transferencias={transferencias}
              loading={loading}
              onVerDetalle={handleVerDetalle}
              onConfirmarRecepcion={handleAbrirModalConfirmar}
              onCancelar={handleCancelarTransferencia}
            />

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="p-4 bg-white shadow-sm">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) - 1 })}
                    disabled={filtros.page === 1}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-100 ring-1 ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-slate-600 px-4">
                    Página {filtros.page || 1} de {totalPages}
                  </span>
                  <button
                    onClick={() => setFiltros({ ...filtros, page: (filtros.page || 1) + 1 })}
                    disabled={filtros.page === totalPages}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-100 ring-1 ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Nueva Transferencia */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-slate-200">
            <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-200/60 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                  <Plus size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Nueva Transferencia</h2>
                  <p className="text-sm text-gray-600">Crear una nueva transferencia entre almacenes</p>
                </div>
              </div>
              <button
                onClick={() => setMostrarFormulario(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <FormularioNuevaTransferencia
                onGuardar={handleNuevaTransferencia}
                onCancelar={() => setMostrarFormulario(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmar Recepción */}
      {transferenciaAConfirmar && (
        <ModalConfirmarRecepcion
          transferencia={transferenciaAConfirmar}
          onConfirmar={handleConfirmarRecepcion}
          onCancelar={() => setTransferenciaAConfirmar(null)}
        />
      )}
    </div>
  );
}


