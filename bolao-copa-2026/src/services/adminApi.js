import { BASE_URL } from './api';

const adminRequest = async (method, path, fields = null) => {
  const headers = { Authorization: `Bearer ${global.authToken}` };
  let body;
  if (fields) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = Object.entries(fields)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method, headers, body, signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`Operação recusada pelo servidor (${response.status}).`);
    return text;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('O servidor demorou para responder.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

const clean = (value = '') => value
  .replace(/<[^>]*>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .trim();

export const buscarDashboardAdmin = async () => {
  const html = await adminRequest('GET', '/dashboard');
  const labels = ['Total de Usuários', 'Total de Palpites', 'Partidas Pendentes', 'Ativos'];
  const values = {};
  labels.forEach((label) => {
    const index = html.indexOf(label);
    const trecho = index >= 0 ? html.slice(index, index + 500) : '';
    const match = trecho.match(/<p[^>]*>\s*(\d+)\s*<\/p>/i);
    values[label] = Number(match?.[1] || 0);
  });
  return {
    totalUsuarios: values['Total de Usuários'],
    totalPalpites: values['Total de Palpites'],
    partidasPendentes: values['Partidas Pendentes'],
    usuariosAtivos24h: values.Ativos,
  };
};

export const listarUsuariosAdmin = async () => {
  const html = await adminRequest('GET', '/admin/usuarios');
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].slice(1);
  return rows.map((row) => {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => clean(cell[1]));
    return cells.length >= 5 ? {
      id: Number(cells[0]), nome: cells[1], email: cells[2],
      perfil: cells[3], ativo: cells[4].includes('Ativo'),
    } : null;
  }).filter(Boolean);
};

export const criarUsuarioAdmin = (dados) =>
  adminRequest('POST', '/admin/usuarios/novo', dados);
export const editarUsuarioAdmin = (id, dados) =>
  adminRequest('POST', `/admin/usuarios/editar/${id}`, { id, ...dados });
export const alternarStatusUsuario = (id) =>
  adminRequest('POST', `/admin/usuarios/status/${id}`, {});
export const excluirUsuarioAdmin = (id) =>
  adminRequest('POST', `/admin/usuarios/excluir/${id}`, {});

export const salvarSelecaoAdmin = (dados) =>
  adminRequest('POST', '/admin/selecoes/salvar', dados);
export const excluirSelecaoAdmin = (id) =>
  adminRequest('POST', `/admin/selecoes/excluir/${id}`, {});

export const salvarPartidaAdmin = (dados) =>
  adminRequest('POST', '/admin/partidas/novo', dados);
export const salvarResultadoAdmin = (id, golsMandante, golsVisitante) =>
  adminRequest('POST', `/admin/partidas/resultado/${id}`, { golsMandante, golsVisitante });
export const excluirPartidaAdmin = (id) =>
  adminRequest('POST', `/admin/partidas/excluir/${id}`, {});
