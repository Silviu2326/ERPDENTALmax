import { useState, useEffect } from 'react';
import { FileText, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import {
  generarPrefactura,
  PrefacturaMutua,
  DetalleCobertura,
  TratamientoFacturable,
} from '../../api/facturacionMutuaApi';
import VisorPrefacturaMutua from './VisorPrefacturaMutua';

interface PasoGeneracionPrefacturaProps {
  pacienteId: string;
  mutuaId: string;
  tratamientosSeleccionados: TratamientoFacturable[];
  detallesCobertura: DetalleCobertura[];
  onPrefacturaGenerada: (prefactura: PrefacturaMutua) => void;
}

export default function PasoGeneracionPrefactura({
  pacienteId,
  mutuaId,
  tratamientosSeleccionados,
  detallesCobertura,
  onPrefacturaGenerada,
}: PasoGeneracionPrefacturaProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefactura, setPrefactura] = useState<PrefacturaMutua | null>(null);

  useEffect(() => {
    const generar = async () => {
      if (tratamientosSeleccionados.length === 0 || detallesCobertura.length === 0) {
        setPrefactura(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Mapear los tratamientos seleccionados con los detalles de cobertura
        const tratamientosParaFactura = tratamientosSeleccionados.map((tratamiento) => {
          const detalle = detallesCobertura.find(
            (d) => d.tratamientoId === tratamiento.tratamiento._id
          );
          if (!detalle) {
            throw new Error(`No se encontró el detalle de cobertura para el tratamiento ${tratamiento.tratamiento._id}`);
          }

          return {
            tratamientoId: tratamiento.tratamiento._id,
            codigoMutua: detalle.codigoMutua,
            descripcion: detalle.descripcion,
            precio: detalle.precio,
            cantidad: tratamiento.cantidad,
            importeCubierto: detalle.importeCubierto,
            copago: detalle.copago,
          };
        });

        const resultado = await generarPrefactura(pacienteId, mutuaId, tratamientosParaFactura);
        setPrefactura(resultado);
        onPrefacturaGenerada(resultado);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al generar prefactura');
        setPrefactura(null);
      } finally {
        setLoading(false);
      }
    };

    generar();
  }, [pacienteId, mutuaId, tratamientosSeleccionados, detallesCobertura]);

  const handleRegenerar = async () => {
    setPrefactura(null);
    setError(null);
    // El useEffect se encargará de regenerar automáticamente
  };

  if (tratamientosSeleccionados.length === 0 || detallesCobertura.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No hay datos suficientes para generar la prefactura</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Generando prefactura...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error al generar prefactura</span>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={handleRegenerar}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Intentar nuevamente
        </button>
      </div>
    );
  }

  if (!prefactura) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Paso 4: Generación de Prefactura</h3>
          <p className="text-gray-600 text-sm">
            Revisa el borrador de la factura antes de confirmar y enviar.
          </p>
        </div>
        <button
          onClick={handleRegenerar}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerar
        </button>
      </div>

      {/* Mensaje de éxito */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-medium text-green-900">Prefactura generada correctamente</div>
          <div className="text-sm text-green-700 mt-1">
            Revisa todos los detalles antes de continuar al siguiente paso.
          </div>
        </div>
      </div>

      {/* Visor de prefactura */}
      <VisorPrefacturaMutua prefactura={prefactura} />
    </div>
  );
}


