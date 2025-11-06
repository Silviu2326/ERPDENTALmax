import { useState, useEffect } from 'react';
import { ArrowLeft, Warehouse, MapPin, User, Building2, Edit, ArrowRightLeft } from 'lucide-react';
import { AlmacenDetalle } from '../api/almacenesApi';
import InventarioPorAlmacenList from '../components/InventarioPorAlmacenList';
import ModalCrearEditarAlmacen from '../components/ModalCrearEditarAlmacen';
import ModalTransferenciaStock from '../components/ModalTransferenciaStock';
import { Almacen } from '../api/almacenesApi';

interface DetalleAlmacenPageProps {
  almacenId: string;
  onVolver: () => void;
  almacenes?: Almacen[];
  productos?: Array<{
    _id: string;
    nombre: string;
    sku?: string;
    categoria?: string;
    stockDisponible?: number;
  }>;
  clinicas?: Array<{ _id: string; nombre: string }>;
  responsables?: Array<{ _id: string; nombre: string; apellidos?: string }>;
}

export default function DetalleAlmacenPage({
  almacenId,
  onVolver,
  almacenes = [],
  productos = [],
  clinicas = [],
  responsables = [],
}: DetalleAlmacenPageProps) {
  const [almacen, setAlmacen] = useState<AlmacenDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalTransferir, setMostrarModalTransferir] = useState(false);

  useEffect(() => {
    cargarDetalleAlmacen();
  }, [almacenId]);

  const cargarDetalleAlmacen = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay y construir detalle desde props + datos falsos
      await new Promise(resolve => setTimeout(resolve, 400));
      const base = almacenes.find(a => a._id === almacenId);
      if (!base) {
        throw new Error('Almacén no encontrado');
      }
      const detalleMock: AlmacenDetalle = {
        _id: base._id,
        nombre: base.nombre,
        direccion: base.direccion || { calle: '', ciudad: '', codigoPostal: '' },
        esPrincipal: !!base.esPrincipal,
        activo: base.activo !== false,
        clinicaAsociada: base.clinicaAsociada,
        responsable: base.responsable as any,
        inventario: [
          {
            producto: productos[0] ? { _id: productos[0]._id, nombre: productos[0].nombre, sku: productos[0].sku, categoria: productos[0].categoria } : { _id: '1', nombre: 'Guantes Nitrilo', sku: 'GNT-001', categoria: 'Consumible' },
            cantidad: 150,
          },
          {
            producto: productos[1] ? { _id: productos[1]._id, nombre: productos[1].nombre, sku: productos[1].sku, categoria: productos[1].categoria } : { _id: '2', nombre: 'Jeringas 5ml', sku: 'JNG-002', categoria: 'Consumible' },
            cantidad: 320,
          },
          {
            producto: productos[3] ? { _id: productos[3]._id, nombre: productos[3].nombre, sku: productos[3].sku, categoria: productos[3].categoria } : { _id: '4', nombre: 'Fresas Dentales', sku: 'FRD-004', categoria: 'Instrumental' },
            cantidad: 22,
          },
        ],
      };
      setAlmacen(detalleMock);
    } catch (err) {
      console.error('Error al cargar detalle del almacén:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el almacén');
      // Datos mock para desarrollo
      setAlmacen({
        _id: almacenId,
        nombre: 'Almacén Principal',
        direccion: {
          calle: 'Av. Principal 123',
          ciudad: 'Madrid',
          codigoPostal: '28001',
        },
        esPrincipal: true,
        activo: true,
        inventario: [
          {
            producto: {
              _id: '1',
              nombre: 'Composite A2',
              sku: 'COMP-A2',
              categoria: 'Materiales',
            },
            cantidad: 50,
          },
          {
            producto: {
              _id: '2',
              nombre: 'Guantes Latex',
              sku: 'GUANT-LAT',
              categoria: 'Consumibles',
            },
            cantidad: 200,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarAlmacen = async (datos: any) => {
    if (!almacen?._id) return;
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Actualizando almacén (mock):', almacen._id, datos);
    await cargarDetalleAlmacen();
    setMostrarModalEditar(false);
  };

  const handleTransferir = async (transferencia: any) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    console.log('Transferencia de stock (mock):', transferencia);
    await cargarDetalleAlmacen();
    setMostrarModalTransferir(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Cargando almacén...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !almacen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'No se pudo cargar el almacén'}
          </div>
          <button
            onClick={onVolver}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onVolver}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Warehouse className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{almacen.nombre}</h1>
                <p className="text-gray-600 mt-1">Detalle del almacén</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarModalTransferir(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Transferir Stock
            </button>
            <button
              onClick={() => setMostrarModalEditar(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
          </div>
        </div>

        {/* Información General */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Dirección</p>
                <p className="font-medium text-gray-900">
                  {almacen.direccion.calle}
                </p>
                <p className="text-gray-600">
                  {almacen.direccion.ciudad}, {almacen.direccion.codigoPostal}
                </p>
              </div>
            </div>

            {almacen.clinicaAsociada && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Clínica Asociada</p>
                  <p className="font-medium text-gray-900">
                    {almacen.clinicaAsociada.nombre}
                  </p>
                </div>
              </div>
            )}

            {almacen.responsable && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Responsable</p>
                  <p className="font-medium text-gray-900">
                    {almacen.responsable.nombre} {almacen.responsable.apellidos || ''}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Warehouse className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium text-gray-900">
                  {almacen.activo ? 'Activo' : 'Inactivo'}
                </p>
                {almacen.esPrincipal && (
                  <p className="text-sm text-yellow-600 font-medium">Almacén Principal</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Inventario */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Inventario</h2>
          <InventarioPorAlmacenList almacen={almacen} />
        </div>
      </div>

      {/* Modales */}
      {mostrarModalEditar && (
        <ModalCrearEditarAlmacen
          almacen={almacen}
          isOpen={mostrarModalEditar}
          onClose={() => setMostrarModalEditar(false)}
          onSave={handleGuardarAlmacen}
          clinicas={clinicas}
          responsables={responsables}
        />
      )}

      {mostrarModalTransferir && (
        <ModalTransferenciaStock
          almacenOrigen={almacen}
          almacenes={almacenes}
          productos={productos}
          isOpen={mostrarModalTransferir}
          onClose={() => setMostrarModalTransferir(false)}
          onTransferir={handleTransferir}
        />
      )}
    </div>
  );
}


