import AuthLayout from '../components/AuthLayout';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

interface ForgotPasswordPageProps {
  onBack?: () => void;
}

export default function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Te enviaremos un enlace para restablecer tu contraseña"
    >
      <ForgotPasswordForm onBack={onBack} onSuccess={onBack} />
    </AuthLayout>
  );
}



