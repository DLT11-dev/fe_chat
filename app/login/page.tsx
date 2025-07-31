import LoginForm from '@/components/LoginForm';
import AuthError from '@/components/AuthError';

export default function LoginPage() {
  return (
    <>
      <AuthError />
      <LoginForm />
    </>
  );
} 