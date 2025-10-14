// components/PrivateRoute.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { token } = parseCookies();

    if (token) {
      // Aqui você pode adicionar uma lógica mais robusta,
      // como verificar a validade do token com uma chamada à API.
      setIsAuthenticated(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (isAuthenticated) {
    return children;
  }

  return null; // O componente não renderiza nada enquanto o estado de autenticação é verificado.
};

export default PrivateRoute;