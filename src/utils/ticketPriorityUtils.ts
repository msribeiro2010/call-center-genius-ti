
export const getPriorityVariant = (prioridade: number) => {
  switch (prioridade) {
    case 5:
      return "destructive"; // Crítica
    case 4:
      return "destructive"; // Alta
    case 3:
      return "default"; // Média
    case 2:
      return "secondary"; // Baixa
    case 1:
      return "secondary"; // Muito baixa
    default:
      return "default";
  }
};

export const getPriorityLabel = (prioridade: number) => {
  switch (prioridade) {
    case 5:
      return "Crítica";
    case 4:
      return "Alta";
    case 3:
      return "Média";
    case 2:
      return "Baixa";
    case 1:
      return "Muito baixa";
    default:
      return "Não definida";
  }
};
