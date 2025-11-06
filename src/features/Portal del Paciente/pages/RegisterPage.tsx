import { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import RegistrationForm from '../components/RegistrationForm';
import { CheckCircle } from 'lucide-react';

interface RegisterPageProps {
  onLogin?: () => void;
}

export default function RegisterPage({ onLogin }: RegisterPageProps) {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegisterSuccess = () => {
    setRegistrationSuccess(true);
  };

  if (registrationSuccess) {
    return (
      <AuthLayout
        title="¡Registro exitoso!"
        subtitle="Verifica tu correo electrónico"
      >
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">¡Cuenta creada exitosamente!</p>
              <p>
                Hemos enviado un correo de verificación a tu dirección de email. 
                Por favor, revisa tu bandeja de entrada y haz clic en el enlace 
                para verificar tu cuenta antes de iniciar sesión.
              </p>
            </div>
          </div>
          {onLogin && (
            <button
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Volver al inicio de sesión
            </button>
          )}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Crear Cuenta"
      subtitle="Regístrate en el Portal del Paciente"
    >
      <RegistrationForm
        onRegisterSuccess={handleRegisterSuccess}
        onLogin={onLogin}
      />
    </AuthLayout>
  );
}


