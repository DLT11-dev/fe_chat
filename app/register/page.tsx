import RegisterForm from '@/components/RegisterForm';
import AuthError from '@/components/AuthError';

export default function RegisterPage() {
  return (
    <>
      <AuthError />
      <RegisterForm />
    </>
  );
} 