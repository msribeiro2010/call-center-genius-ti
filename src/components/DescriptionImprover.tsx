
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';

interface DescriptionImproverProps {
  currentDescription: string;
  onImprovedDescription: (improvedText: string) => void;
  context?: string;
}

const DescriptionImprover: React.FC<DescriptionImproverProps> = ({
  currentDescription,
  onImprovedDescription,
  context
}) => {
  const { toast } = useToast();
  const [isImproving, setIsImproving] = useState(false);

  const improveDescription = async () => {
    if (!currentDescription.trim()) {
      toast({
        title: "Aviso",
        description: "Digite uma descrição antes de melhorar o texto",
        variant: "destructive"
      });
      return;
    }

    setIsImproving(true);

    try {
      const { data, error } = await supabase.functions.invoke('improve-description', {
        body: {
          description: currentDescription,
          context: context || 'Chamado técnico do sistema PJe'
        }
      });

      if (error) throw error;

      if (data?.improvedDescription) {
        onImprovedDescription(data.improvedDescription);
        toast({
          title: "Sucesso!",
          description: "Descrição melhorada com IA"
        });
      } else {
        throw new Error('Resposta inválida da IA');
      }
    } catch (error) {
      console.error('Erro ao melhorar descrição:', error);
      toast({
        title: "Erro",
        description: "Erro ao melhorar descrição com IA. Verifique se a chave da OpenAI está configurada.",
        variant: "destructive"
      });
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={improveDescription}
      disabled={isImproving || !currentDescription.trim()}
      className="ml-2"
    >
      {isImproving ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 mr-2" />
      )}
      {isImproving ? 'Melhorando...' : 'Melhorar com IA'}
    </Button>
  );
};

export default DescriptionImprover;
