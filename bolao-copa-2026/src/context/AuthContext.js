import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null); // { id, nome, perfil, token }

  const salvarSessao = (dados) => {
    global.authToken = dados.token; // picked up by axios interceptor
    setUsuario(dados);
  };

  const encerrarSessao = () => {
    global.authToken = null;
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, salvarSessao, encerrarSessao }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
