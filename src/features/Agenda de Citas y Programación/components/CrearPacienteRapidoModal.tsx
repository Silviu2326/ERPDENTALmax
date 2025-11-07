import { useState } from 'react';
import { X, Save, User, Loader2, AlertCircle } from 'lucide-react';
import { Paciente } from '../api/citasApi';

interface CrearPacienteRapidoModalProps {
  onClose: () => void;
  onPacienteCreado: (paciente: Paciente) => void;
}

interface DatosPacienteRapido {
  nombre: string;
  apellidos: string;
  documentoIdentidad?: string;
  telefono?: string;
  email?: string;
}

export default function CrearPacienteRapidoModal({
  onClose,
  onPacienteCreado,
}: CrearPacienteRapidoModalProps) {
  const [formData, setFormData] = useState<DatosPacienteRapido>({
    nombre: '',
    apellidos: '',
    documentoIdentidad: '',
    telefono: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

  const handleChange = (key: keyof DatosPacienteRapido, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación básica
    if (!formData.nombre.trim() || !formData.apellidos.trim()) {
      setError('Nombre y apellidos son obligatorios');
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para el backend
      const datosEnvio = {
        datosPersonales: {
          nombre: formData.nombre.trim(),
          apellidos: formData.apellidos.trim(),
          dni: formData.documentoIdentidad?.trim() || undefined,
        },
        contacto: {
          telefono: formData.telefono?.trim() || undefined,
          email: formData.email?.trim() || undefined,
        },
        administrativo: {
          estado: 'Activo',
        },
      };

      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(datosEnvio),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el paciente');
      }

      const pacienteCreado: Paciente = await response.json();
      onPacienteCreado(pacienteCreado);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Crear Paciente Rápido</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del paciente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellidos *
            </label>
            <input
              type="text"
              required
              value={formData.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Apellidos del paciente"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI / Documento de Identidad
            </label>
            <input
              type="text"
              value={formData.documentoIdentidad}
              onChange={(e) => handleChange('documentoIdentidad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Opcional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Opcional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Opcional"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              * Campos obligatorios. Podrás completar el resto de la información más tarde desde la ficha del paciente.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Crear Paciente</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



