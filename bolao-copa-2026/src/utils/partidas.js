export const dataDaPartida = (partida) => new Date(partida.dataHora);
export const partidaIniciou = (partida) =>
  partida.encerrada || dataDaPartida(partida).getTime() <= Date.now();
export const statusDaPartida = (partida) => {
  if (partida.encerrada) return { label: 'Encerrada', tone: 'danger' };
  if (partidaIniciou(partida)) return { label: 'Em andamento', tone: 'info' };
  return { label: 'Aberta para palpite', tone: 'success' };
};
export const formatarData = (dataHora) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(dataHora));
export const placarReal = (partida) =>
  partida.golsMandante == null ? '–  ×  –' : `${partida.golsMandante}  ×  ${partida.golsVisitante}`;
