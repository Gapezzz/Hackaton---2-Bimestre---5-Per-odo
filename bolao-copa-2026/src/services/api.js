const BASE_URL = 'http://192.168.18.6:8080';

const request = async (method, path, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (global.authToken) {
    headers.Authorization = `Bearer ${global.authToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch (_) { data = text; }

  if (!res.ok) {
    const err = new Error(data?.message || data || 'Erro na requisição');
    err.response = { status: res.status, data };
    throw err;
  }

  return { data, status: res.status };
};

export const cadastrar = (nome, email, senha) =>
  request('POST', '/api/autenticacao/cadastro', { nome, email, senha });

export const login = (email, senha) =>
  request('POST', '/api/autenticacao/login', { email, senha });

export const logout = () =>
  request('POST', '/api/autenticacao/logout');

export const editarPerfil = (nome, fotoUrl = null) =>
  request('PUT', '/api/autenticacao/perfil', { nome, fotoUrl });

export const excluirConta = () =>
  request('DELETE', '/api/autenticacao/conta');