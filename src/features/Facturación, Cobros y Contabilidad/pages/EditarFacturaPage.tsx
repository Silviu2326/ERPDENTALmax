import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { obtenerFacturaPorId, FacturaDetallada } from '../api/facturacionApi';
import FormularioEdicionFactura from '../components/FormularioEdicionFactura';

interface EditarFacturaPageProps {
  facturaId: string;
  onVolver?: () => void;
  onFacturaActualizada?: (factura: FacturaDetallada) => void;
}

export default function EditarFacturaPage({
  facturaId,
  onVolver,
  onFacturaActualizada,
}: EditarFacturaPageProps) {
  const [factura, setFactura] = useState<FacturaDetallada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarFactura = async () => {
      setLoading(true);
      setError(null);

      try {
        const facturaData = await obtenerFacturaPorId(facturaId);
        setFactura(facturaData);
      } catch (err) {
        // Datos mock para desarrollo
        const facturaMock: FacturaDetallada = {
          _id: facturaId,
          paciente: {
            _id: '1',
            nombre: 'Ana',
            apellidos: 'Martínez',
            documentoIdentidad: '12345678A',
          },
          numeroFactura: 'FAC-2024-001',
          fechaEmision: new Date().toISOString(),
          fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              _id: '1',
              tratamiento: {
                _id: '1',
                nombre: 'Limpieza dental',
              },
              descripcion: 'Limpieza dental profesional',
              cantidad: 1,
              precioUnitario: 50,
              descuento: 0,
              impuesto: 21,
              totalItem: 60.5,
            },
            {
              _id: '2',
              tratamiento: {
                _id: '2',
                nombre: 'Revisión general',
              },
              descripcion: 'Revisión completa de la boca',
              cantidad: 1,
              precioUnitario: 30,
              descuento: 10,
              impuesto: 21,
              totalItem: 32.67,
            },
          ],
          subtotal: 90,
          totalImpuestos: 18.9,
          totalDescuentos: 3,
          total: 108.9,
          estado: 'emitida',
          historialCambios: [
            {
              usuario: {
                _id: '1',
                nombre: 'Juan Pérez',
              },
              fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              campo: 'Cantidad',
              valorAnterior: '2',
              valorNuevo: '1',
            },
          ],
          notas: 'Factura de prueba',
        };
        setFactura(facturaMock);
        setError(err instanceof Error ? err.message : 'Error al cargar la factura');
      } finally {
        setLoading(false);
      }
    };

    if (facturaId) {
      cargarFactura();
    }
  }, [facturaId]);

  const handleGuardar = (facturaActualizada: FacturaDetallada) => {
    setFactura(facturaActualizada);
    if (onFacturaActualizada) {
      onFacturaActualizada(facturaActualizada);
    }
    if (onVolver) {
      // Opcional: redirigir después de guardar
      // onVolver();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Cargando factura...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !factura) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-1">Error al cargar la factura</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          {onVolver && (
            <button
              onClick={onVolver}
              className="mt-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!factura) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">No se encontró la factura</p>
            {onVolver && (
              <button
                onClick={onVolver}
                className="mt-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {onVolver && (
          <button
            onClick={onVolver}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Panel de Facturación</span>
          </button>
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Editar Factura</h1>
          <p className="text-gray-600 mt-1">
            Modifica los datos de la factura antes de que sea cerrada o pagada
          </p>
        </div>

        {/* Formulario */}
        <FormularioEdicionFactura
          factura={factura}
          onGuardar={handleGuardar}
          onCancelar={onVolver || (() => {})}
        />

        {/* Mostrar error si existe pero también hay factura (datos mock) */}
        {error && factura && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              Nota: Se están mostrando datos de ejemplo. {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


