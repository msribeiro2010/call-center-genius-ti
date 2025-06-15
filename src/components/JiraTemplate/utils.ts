
export const formatPriority = (prioridade: number) => {
  return prioridade.toString();
};

export const formatType = (tipo: string) => {
  const typeMap: { [key: string]: string } = {
    'incidente': 'Incident',
    'requisicao': 'Service Request',
    'problema': 'Problem',
    'mudanca': 'Change'
  };
  return typeMap[tipo] || 'Incident';
};
