export const BASE_URL = 'http://192.168.0.102:8080';

const request = async (method, path, body = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  if (global.authToken) headers.Authorization = `Bearer ${global.authToken}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('O servidor demorou para responder. Confirme se o backend está rodando na porta 8080.');
    }
    throw new Error('Não foi possível conectar ao servidor. Verifique o backend, o Wi-Fi e o endereço da API.');
  } finally {
    clearTimeout(timeout);
  }

  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch (_) { data = text; }

  if (!res.ok) {
    const err = new Error(data?.message || data?.erro || data || 'Erro na requisição');
    err.response = { status: res.status, data };
    throw err;
  }

  return { data, status: res.status };
};

const queryString = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) =>
    value !== undefined && value !== null && value !== ''
  );
  return entries.length
    ? `?${entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`
    : '';
};

export const cadastrar = (nome, email, senha) =>
  request('POST', '/api/autenticacao/cadastro', { nome, email, senha });
export const login = (email, senha) =>
  request('POST', '/api/autenticacao/login', { email, senha });
export const logout = () => request('POST', '/api/autenticacao/logout');
export const editarPerfil = (nome, fotoUrl = null) =>
  request('PUT', '/api/autenticacao/perfil', { nome, fotoUrl });
export const excluirConta = () => request('DELETE', '/api/autenticacao/conta');

export const listarPartidas = (filtros = {}) =>
  request('GET', `/api/partidas${queryString(filtros)}`);
export const listarProximasPartidas = () =>
  request('GET', '/api/partidas/proximas');
export const buscarPartida = (id) =>
  request('GET', `/api/partidas/${id}`);
export const listarMeusPalpites = () =>
  request('GET', '/api/palpites/meus');
export const salvarPalpite = (partidaId, golsMandanteAposta, golsVisitanteAposta) =>
  request('POST', '/api/palpites', {
    partidaId,
    golsMandanteAposta,
    golsVisitanteAposta,
  });
export const listarRanking = (pagina = 0, tamanhoPagina = 50) =>
  request('GET', `/api/ranking${queryString({ pagina, tamanhoPagina })}`);
export const buscarMinhaPosicao = () =>
  request('GET', '/api/ranking/minha-posicao');
export const listarSelecoes = () =>
  request('GET', '/api/selecoes');
