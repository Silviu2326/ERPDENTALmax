import { useState, useEffect } from 'react';
import { AlertTriangle, X, User } from 'lucide-react';
import { buscarPacientesDuplicados, CriteriosBusquedaDuplicados, Paciente } from '../api/pacientesApi';

interface BuscadorPacientesDuplicadosProps {
  dni?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
  onPacientesEncontrados?: (pacientes: Paciente[]) => void;
}

export default function BuscadorPacientesDuplicados({
  dni,
  nombre,
  apellidos,
  email,
  onPacientesEncontrados,
}: BuscadorPacientesDuplicadosProps) {
  const [pacientesDuplicados, setPacientesDuplicados] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(true);

  useEffect(() => {
    // Debounce para evitar demasiadas llamadas a la API
    const timeoutId = setTimeout(() => {
      const criterios: CriteriosBusquedaDuplicados = {};

      if (dni && dni.trim().length >= 3) {
        criterios.dni = dni.trim();
      }
      if (nombre && nombre.trim().length >= 2) {
        criterios.nombre = nombre.trim();
      }
      if (apellidos && apellidos.trim().length >= 2) {
        criterios.apellidos = apellidos.trim();
      }
      if (email && email.trim().length >= 3) {
        criterios.email = email.trim();
      }

      // Solo buscar si hay al menos un criterio válido
      if (Object.keys(criterios).length > 0) {
        setLoading(true);
        buscarPacientesDuplicados(criterios)
          .then((resultados) => {
            setPacientesDuplicados(resultados);
            if (onPacientesEncontrados) {
              onPacientesEncontrados(resultados);
            }
          })
          .catch(() => {
            // Ignorar errores silenciosamente en desarrollo
            setPacientesDuplicados([]);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setPacientesDuplicados([]);
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [dni, nombre, apellidos, email, onPacientesEncontrados]);

  if (pacientesDuplicados.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {mostrarAlerta && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Se encontraron {pacientesDuplicados.length} paciente(s) similar(es)
                </h4>
                <div className="space-y-2">
                  {pacientesDuplicados.map((paciente) => (
                    <div
                      key={paciente._id}
                      className="bg-white rounded-xl p-3 border border-yellow-300 flex items-center gap-3"
                    >
                      <User size={16} className="text-gray-500" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {paciente.nombre} {paciente.apellidos}
                        </p>
                        {paciente.DNI && (
                          <p className="text-sm text-gray-600">DNI: {paciente.DNI}</p>
                        )}
                        {paciente.email && (
                          <p className="text-sm text-gray-600">Email: {paciente.email}</p>
                        )}
                        {paciente.telefonos && paciente.telefonos.length > 0 && (
                          <p className="text-sm text-gray-600">Tel: {paciente.telefonos[0]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-yellow-700 mt-3">
                  Por favor, verifica que el paciente no esté ya registrado antes de continuar.
                </p>
              </div>
            </div>
            <button
              onClick={() => setMostrarAlerta(false)}
              className="text-yellow-600 hover:text-yellow-800 flex-shrink-0 transition-all"
              aria-label="Cerrar alerta"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



