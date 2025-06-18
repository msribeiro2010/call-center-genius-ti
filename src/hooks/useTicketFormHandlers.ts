
import { useToast } from '@/components/ui/use-toast';
import { useOJDetection } from './useOJDetection';
import { useCPFValidation } from './useCPFValidation';
import { useUsuarios } from './useUsuarios';
import { useProcessos } from './useProcessos';

interface FormData {
  chamadoOrigem: string;
  numeroProcesso: string;
  grau: string;
  orgaoJulgador: string;
  ojDetectada: string;
  descricao: string;
  prioridade: number;
  tipo: string;
  nomeUsuarioAfetado: string;
  cpfUsuarioAfetado: string;
  perfilUsuarioAfetado: string;
  assuntoId: string;
}

export const useTicketFormHandlers = (
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  editingTicket?: any
) => {
  const { toast } = useToast();
  const { ojData, detectarOJ, clearOJData } = useOJDetection();
  const { formatCPF, validateCPF, setCpfError } = useCPFValidation();
  const { buscarUsuarioPorCPF } = useUsuarios();
  const { buscarProcessoPorNumero } = useProcessos();

  const handleProcessoChange = async (value: string) => {
    console.log('Mudança no processo:', value);
    setFormData(prev => ({ ...prev, numeroProcesso: value }));
    
    if (value.trim() && value.length >= 15) {
      // Buscar processo existente
      const processoExistente = await buscarProcessoPorNumero(value);
      
      if (processoExistente) {
        // Preencher automaticamente os campos com os dados encontrados
        setFormData(prev => ({
          ...prev,
          grau: processoExistente.grau || prev.grau,
          orgaoJulgador: processoExistente.orgao_julgador || prev.orgaoJulgador,
          ojDetectada: processoExistente.oj_detectada || prev.ojDetectada
        }));
        
        toast({
          title: "Processo encontrado",
          description: `Dados do processo ${value} preenchidos automaticamente`,
        });
      } else if (!editingTicket && formData.grau === '1') {
        // Se não encontrou processo e é 1º grau, detectar OJ automaticamente
        console.log('Detectando OJ para 1º grau');
        detectarOJ(value, '1');
      }
    } else if (!value.trim()) {
      clearOJData();
    }
  };

  const handleGrauChange = (value: string) => {
    console.log('Mudança no grau:', value);
    setFormData(prev => ({ 
      ...prev, 
      grau: value, 
      orgaoJulgador: '', 
      ojDetectada: '' 
    }));
    
    // Limpar apenas os dados de OJ, mas manter o grau no hook
    clearOJData();
    
    // Se há um número de processo e o usuário escolheu 1º grau, detectar OJ automaticamente
    if (value === '1' && formData.numeroProcesso.trim()) {
      console.log('Detectando OJ automaticamente para 1º grau');
      detectarOJ(formData.numeroProcesso, '1');
    }
  };

  const handleCPFChange = async (value: string) => {
    // Formatar CPF enquanto digita
    const formattedCPF = formatCPF(value);
    setFormData(prev => ({ ...prev, cpfUsuarioAfetado: formattedCPF }));
    
    // Validar apenas se o campo estiver completo
    if (formattedCPF.length === 14) {
      const isValid = validateCPF(formattedCPF);
      
      if (isValid) {
        // Buscar usuário existente pelo CPF
        const usuarioExistente = await buscarUsuarioPorCPF(formattedCPF);
        
        if (usuarioExistente) {
          // Preencher automaticamente os campos com os dados encontrados
          setFormData(prev => ({
            ...prev,
            nomeUsuarioAfetado: usuarioExistente.nome_completo,
            perfilUsuarioAfetado: usuarioExistente.perfil || ''
          }));
          
          toast({
            title: "Usuário encontrado",
            description: `Dados de ${usuarioExistente.nome_completo} preenchidos automaticamente`,
          });
        } else {
          // Limpar campos se não encontrar usuário
          setFormData(prev => ({
            ...prev,
            nomeUsuarioAfetado: '',
            perfilUsuarioAfetado: ''
          }));
        }
      }
    } else {
      setCpfError('');
      // Limpar campos quando CPF não estiver completo
      if (formattedCPF.length < 14) {
        setFormData(prev => ({
          ...prev,
          nomeUsuarioAfetado: '',
          perfilUsuarioAfetado: ''
        }));
      }
    }
  };

  const handleImprovedDescription = (improvedText: string) => {
    setFormData(prev => ({ ...prev, descricao: improvedText }));
  };

  return {
    ojData,
    clearOJData,
    handleProcessoChange,
    handleGrauChange,
    handleCPFChange,
    handleImprovedDescription
  };
};
