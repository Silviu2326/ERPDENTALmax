import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, DollarSign, Percent, Shield } from 'lucide-react';
import {
  verificarCobertura,
  DetalleCobertura,
  VerificacionCoberturaResponse,
  TratamientoFacturable,
} from '../../api/facturacionMutuaApi';

interface PasoVerificacionCoberturaProps {
  pacienteId: string;
  mutuaId: string;
  tratamientosSeleccionados: TratamientoFacturable[];
  onCoberturaVerificada: (detalles: DetalleCobertura[], verificacion: VerificacionCoberturaResponse) => void;
}

export default function PasoVerificacionCobertura({
  pacienteId,
  mutuaId,
  tratamientosSeleccionados,
  onCoberturaVerificada,
}: PasoVerificacionCoberturaProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificacion, setVerificacion] = useState<VerificacionCoberturaResponse | null>(null);

  useEffect(() => {
    const verificar = async () => {
      if (tratamientosSeleccionados.length === 0) {
        setVerificacion(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const tratamientosIds = tratamientosSeleccionados.map((t) => t.tratamiento._id);
        const resultado = await verificarCobertura(pacienteId, mutuaId, tratamientosIds);
        setVerificacion(resultado);
        onCoberturaVerificada(resultado.detalles, resultado);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al verificar cobertura');
        setVerificacion(null);
      } finally {
        setLoading(false);
      }
    };

    verificar();
  }, [pacienteId, mutuaId, tratamientosSeleccionados, onCoberturaVerificada]);

  if (tratamientosSeleccionados.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Selecciona tratamientos en el paso anterior para verificar su cobertura</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Verificando cobertura de tratamientos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Error al verificar cobertura</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!verificacion) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Paso 3: Verificación de Cobertura</h3>
        <p className="text-gray-600 text-sm">
          Revisa los detalles de cobertura para cada tratamiento seleccionado.
        </p>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Total Factura</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{verificacion.total.toFixed(2)} €</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Cubierto por Mutua</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{verificacion.totalCubierto.toFixed(2)} €</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Percent className="w-5 h-5" />
            <span className="text-sm font-medium">Copago del Paciente</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{verificacion.totalCopago.toFixed(2)} €</div>
        </div>
      </div>

      {/* Detalles por tratamiento */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Detalle por Tratamiento</h4>
        {verificacion.detalles.map((detalle, index) => {
          const tratamiento = tratamientosSeleccionados.find(
            (t) => t.tratamiento._id === detalle.tratamientoId
          );
          return (
            <div
              key={detalle.tratamientoId}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{detalle.descripcion}</div>
                  {tratamiento && (
                    <div className="text-sm text-gray-600 mt-1">
                      {tratamiento.tratamiento.nombre}
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    Código Mutua: {detalle.codigoMutua}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Precio</div>
                  <div className="font-semibold text-gray-900">{detalle.precio.toFixed(2)} €</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Cobertura</div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${detalle.cobertura}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{detalle.cobertura}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Cubierto</div>
                  <div className="text-sm font-semibold text-green-600">
                    {detalle.importeCubierto.toFixed(2)} €
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Copago</div>
                  <div className="text-sm font-semibold text-orange-600">
                    {detalle.copago.toFixed(2)} €
                  </div>
                </div>
              </div>

              {detalle.limitacion && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  <span className="font-medium">Limitación:</span> {detalle.limitacion}
                </div>
              )}

              {detalle.requiereAutorizacion && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  <span className="font-medium">Requiere autorización previa</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Alerta de éxito */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-medium text-green-900">Cobertura verificada correctamente</div>
          <div className="text-sm text-green-700 mt-1">
            Puedes continuar al siguiente paso para generar la prefactura.
          </div>
        </div>
      </div>
    </div>
  );
}

