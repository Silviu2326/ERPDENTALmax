import { useState, useEffect } from 'react';
import { Plus, Warehouse } from 'lucide-react';
import AlmacenesDataTable from './AlmacenesDataTable';
import ModalCrearEditarAlmacen from './ModalCrearEditarAlmacen';
import ModalTransferenciaStock from './ModalTransferenciaStock';
import DetalleAlmacenPage from '../pages/DetalleAlmacenPage';
import {
  obtenerAlmacenes,
  crearAlmacen,
  actualizarAlmacen,
  eliminarAlmacen,
  realizarTransferenciaStock,
  Almacen,
} from '../api/almacenesApi';

export default function GestionAlmacenesTab() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [almacenEditando, setAlmacenEditando] = useState<Almacen | undefined>();
  const [almacenParaTransferir, setAlmacenParaTransferir] = useState<Almacen | undefined>();
  const [almacenDetalleId, setAlmacenDetalleId] = useState<string | null>(null);
  const [productos, setProductos] = useState<Array<{
    _id: string;
    nombre: string;
    sku?: string;
    categoria?: string;
    stockDisponible?: number;
  }>>([]);
  const [clinicas, setClinicas] = useState<Array<{ _id: string; nombre: string }>>([]);
  const [responsables, setResponsables] = useState<Array<{ _id: string; nombre: string; apellidos?: string }>>([]);

  // Métricas de almacenes (cliente)
  const totalActivos = almacenes.filter((a) => a.activo).length;
  const totalPrincipales = almacenes.filter((a) => a.esPrincipal).length;
  const totalConResponsable = almacenes.filter((a) => !!a.responsable?._id).length;

  useEffect(() => {
    cargarAlmacenes();
    cargarDatosAdicionales();
  }, []);

  const cargarAlmacenes = async () => {
    setLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos falsos de almacenes
      const datosFalsos: Almacen[] = [
        {
          _id: '1',
          nombre: 'Almacén Principal',
          direccion: {
            calle: 'Avenida de la Paz 45',
            ciudad: 'Madrid',
            codigoPostal: '28028',
          },
          esPrincipal: true,
          activo: true,
          clinicaAsociada: {
            _id: '1',
            nombre: 'Clínica Dental Centro',
          },
          responsable: {
            _id: '1',
            nombre: 'Juan',
            apellidos: 'Pérez García',
          },
          createdAt: '2024-01-10T09:00:00Z',
        },
        {
          _id: '2',
          nombre: 'Almacén Sede Norte',
          direccion: {
            calle: 'Calle Norte 123',
            ciudad: 'Madrid',
            codigoPostal: '28002',
          },
          esPrincipal: false,
          activo: true,
          clinicaAsociada: {
            _id: '2',
            nombre: 'Clínica Dental Norte',
          },
          responsable: {
            _id: '2',
            nombre: 'María',
            apellidos: 'López Sánchez',
          },
          createdAt: '2024-02-15T10:30:00Z',
        },
        {
          _id: '3',
          nombre: 'Almacén Sede Sur',
          direccion: {
            calle: 'Avenida del Sur 78',
            ciudad: 'Madrid',
            codigoPostal: '28041',
          },
          esPrincipal: false,
          activo: true,
          clinicaAsociada: {
            _id: '3',
            nombre: 'Clínica Dental Sur',
          },
          responsable: {
            _id: '3',
            nombre: 'Carlos',
            apellidos: 'Martínez Ruiz',
          },
          createdAt: '2024-03-01T11:15:00Z',
        },
        {
          _id: '4',
          nombre: 'Almacén Central de Suministros',
          direccion: {
            calle: 'Polígono Industrial Norte, Nave 12',
            ciudad: 'Getafe',
            codigoPostal: '28905',
          },
          esPrincipal: false,
          activo: true,
          clinicaAsociada: {
            _id: '1',
            nombre: 'Clínica Dental Centro',
          },
          responsable: {
            _id: '4',
            nombre: 'Ana',
            apellidos: 'García Fernández',
          },
          createdAt: '2024-01-20T14:00:00Z',
        },
        {
          _id: '5',
          nombre: 'Almacén Temporal',
          direccion: {
            calle: 'Calle Temporal 5',
            ciudad: 'Madrid',
            codigoPostal: '28015',
          },
          esPrincipal: false,
          activo: false,
          clinicaAsociada: {
            _id: '1',
            nombre: 'Clínica Dental Centro',
          },
          responsable: {
            _id: '5',
            nombre: 'Pedro',
            apellidos: 'Sánchez Torres',
          },
          createdAt: '2023-12-05T08:00:00Z',
        },
        {
          _id: '6',
          nombre: 'Almacén Sede Este',
          direccion: {
            calle: 'Avenida del Este 234',
            ciudad: 'Madrid',
            codigoPostal: '28032',
          },
          esPrincipal: false,
          activo: true,
          clinicaAsociada: {
            _id: '4',
            nombre: 'Clínica Dental Este',
          },
          responsable: {
            _id: '6',
            nombre: 'Lucía',
            apellidos: 'Fernández Moreno',
          },
          createdAt: '2024-02-10T09:00:00Z',
        },
        {
          _id: '7',
          nombre: 'Almacén de Materiales Quirúrgicos',
          direccion: {
            calle: 'Polígono Industrial Sur, Nave 5',
            ciudad: 'Getafe',
            codigoPostal: '28906',
          },
          esPrincipal: false,
          activo: true,
          clinicaAsociada: {
            _id: '1',
            nombre: 'Clínica Dental Centro',
          },
          responsable: {
            _id: '7',
            nombre: 'Roberto',
            apellidos: 'García López',
          },
          createdAt: '2024-01-18T11:30:00Z',
        },
      ];
      
      setAlmacenes(datosFalsos);
    } catch (error) {
      console.error('Error al cargar almacenes:', error);
      setAlmacenes([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosAdicionales = async () => {
    // Datos falsos para productos - Ampliados
      setProductos([
        { _id: '1', nombre: 'Guantes Nitrilo', sku: 'GNT-001', categoria: 'Consumible', stockDisponible: 500 },
        { _id: '2', nombre: 'Jeringas Desechables', sku: 'JNG-002', categoria: 'Consumible', stockDisponible: 300 },
        { _id: '3', nombre: 'Anestesia Local', sku: 'ANT-003', categoria: 'Consumible', stockDisponible: 150 },
        { _id: '4', nombre: 'Fresas Dentales', sku: 'FRD-004', categoria: 'Instrumental', stockDisponible: 200 },
        { _id: '5', nombre: 'Sillón Dental', sku: 'SIL-005', categoria: 'Equipamiento', stockDisponible: 5 },
        { _id: '6', nombre: 'Composite Resina Dental A2', sku: 'COM-006', categoria: 'Consumible', stockDisponible: 180 },
        { _id: '7', nombre: 'Lámpara de Polimerización LED', sku: 'LAM-007', categoria: 'Equipamiento', stockDisponible: 8 },
        { _id: '8', nombre: 'Mascarillas Quirúrgicas FFP2', sku: 'MAS-008', categoria: 'Consumible', stockDisponible: 320 },
        { _id: '9', nombre: 'Bisturí Desechable Nº15', sku: 'BIS-009', categoria: 'Instrumental', stockDisponible: 250 },
        { _id: '10', nombre: 'Algodón Estéril', sku: 'ALG-012', categoria: 'Consumible', stockDisponible: 95 },
        { _id: '11', nombre: 'Composite Resina Dental B2', sku: 'COM-013', categoria: 'Consumible', stockDisponible: 120 },
        { _id: '12', nombre: 'Gel Desinfectante Manos', sku: 'GEL-014', categoria: 'Consumible', stockDisponible: 85 },
        { _id: '13', nombre: 'Brackets Metálicos Estándar', sku: 'BRK-015', categoria: 'Consumible', stockDisponible: 15 },
        { _id: '14', nombre: 'Arco de Ortodoncia 0.014', sku: 'ARCO-016', categoria: 'Consumible', stockDisponible: 45 },
        { _id: '15', nombre: 'Solución Esterilizante Glutaraldehído', sku: 'EST-017', categoria: 'Consumible', stockDisponible: 30 },
        { _id: '16', nombre: 'Turbina Dental de Alta Velocidad', sku: 'TUR-018', categoria: 'Equipamiento', stockDisponible: 6 },
        { _id: '17', nombre: 'Jeringa de Anestesia Carpule', sku: 'JNG-019', categoria: 'Instrumental', stockDisponible: 180 },
        { _id: '18', nombre: 'Película Radiográfica Digital', sku: 'RAD-020', categoria: 'Consumible', stockDisponible: 12 },
        { _id: '19', nombre: 'Cemento de Ionómero de Vidrio', sku: 'CEM-021', categoria: 'Consumible', stockDisponible: 28 },
        { _id: '20', nombre: 'Sellador de Fosas y Fisuras', sku: 'SEL-022', categoria: 'Consumible', stockDisponible: 65 },
        { _id: '21', nombre: 'Pinza de Extracción Universal', sku: 'PIN-023', categoria: 'Instrumental', stockDisponible: 22 },
        { _id: '22', nombre: 'Sistema de Aspiración Portátil', sku: 'ASP-024', categoria: 'Equipamiento', stockDisponible: 4 },
      ]);
    
    // Datos falsos para clínicas - Ampliados
      setClinicas([
        { _id: '1', nombre: 'Clínica Dental Centro' },
        { _id: '2', nombre: 'Clínica Dental Norte' },
        { _id: '3', nombre: 'Clínica Dental Sur' },
        { _id: '4', nombre: 'Clínica Dental Este' },
        { _id: '5', nombre: 'Clínica Dental Oeste' },
      ]);
    
    // Datos falsos para responsables - Ampliados
      setResponsables([
        { _id: '1', nombre: 'Juan', apellidos: 'Pérez García' },
        { _id: '2', nombre: 'María', apellidos: 'López Sánchez' },
        { _id: '3', nombre: 'Carlos', apellidos: 'Martínez Ruiz' },
        { _id: '4', nombre: 'Ana', apellidos: 'García Fernández' },
        { _id: '5', nombre: 'Pedro', apellidos: 'Sánchez Torres' },
        { _id: '6', nombre: 'Lucía', apellidos: 'Fernández Moreno' },
        { _id: '7', nombre: 'Roberto', apellidos: 'García López' },
        { _id: '8', nombre: 'Sandra', apellidos: 'Martín Díaz' },
      ]);
  };

  const handleCrearAlmacen = async (datos: any) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Creando almacén:', datos);
    await cargarAlmacenes();
    setMostrarModalCrear(false);
  };

  const handleEditarAlmacen = async (datos: any) => {
    if (!almacenEditando?._id) return;
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Actualizando almacén:', almacenEditando._id, datos);
    await cargarAlmacenes();
    setAlmacenEditando(undefined);
  };

  const handleEliminarAlmacen = async (almacenId: string) => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Eliminando almacén:', almacenId);
      await cargarAlmacenes();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el almacén');
    }
  };

  const handleTransferir = async (transferencia: any) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Realizando transferencia:', transferencia);
    await cargarAlmacenes();
    setAlmacenParaTransferir(undefined);
  };

  if (almacenDetalleId) {
    return (
      <DetalleAlmacenPage
        almacenId={almacenDetalleId}
        onVolver={() => setAlmacenDetalleId(null)}
        almacenes={almacenes}
        productos={productos}
        clinicas={clinicas}
        responsables={responsables}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header con botón de crear */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Almacenes</h2>
            <p className="text-gray-600 mt-1">
              Administra los almacenes de tu clínica y gestiona transferencias de stock
            </p>
          </div>
          <button
            onClick={() => setMostrarModalCrear(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nuevo Almacén
          </button>
        </div>
        {/* KPIs */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Almacenes activos</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{totalActivos}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Almacenes principales</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{totalPrincipales}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Con responsable asignado</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{totalConResponsable}</div>
          </div>
        </div>
      </div>

      {/* Tabla de almacenes */}
      <div className="bg-white rounded-lg border border-gray-200">
        <AlmacenesDataTable
          almacenes={almacenes}
          loading={loading}
          onEditar={(almacen) => setAlmacenEditando(almacen)}
          onVerDetalle={(almacenId) => setAlmacenDetalleId(almacenId)}
          onEliminar={handleEliminarAlmacen}
          onTransferir={(almacen) => setAlmacenParaTransferir(almacen)}
        />
      </div>

      {/* Modales */}
      {mostrarModalCrear && (
        <ModalCrearEditarAlmacen
          isOpen={mostrarModalCrear}
          onClose={() => setMostrarModalCrear(false)}
          onSave={handleCrearAlmacen}
          clinicas={clinicas}
          responsables={responsables}
        />
      )}

      {almacenEditando && (
        <ModalCrearEditarAlmacen
          almacen={almacenEditando}
          isOpen={!!almacenEditando}
          onClose={() => setAlmacenEditando(undefined)}
          onSave={handleEditarAlmacen}
          clinicas={clinicas}
          responsables={responsables}
        />
      )}

      {almacenParaTransferir && (
        <ModalTransferenciaStock
          almacenOrigen={almacenParaTransferir}
          almacenes={almacenes}
          productos={productos}
          isOpen={!!almacenParaTransferir}
          onClose={() => setAlmacenParaTransferir(undefined)}
          onTransferir={handleTransferir}
        />
      )}
    </div>
  );
}


