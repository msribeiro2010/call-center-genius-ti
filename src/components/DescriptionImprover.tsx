
import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
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

    // Simular processamento para melhor UX
    setTimeout(() => {
      try {
        const improvedText = applyImprovementRules(currentDescription, context);
        onImprovedDescription(improvedText);
        toast({
          title: "Sucesso!",
          description: "Descrição melhorada automaticamente"
        });
      } catch (error) {
        console.error('Erro ao melhorar descrição:', error);
        toast({
          title: "Erro",
          description: "Erro ao melhorar descrição",
          variant: "destructive"
        });
      } finally {
        setIsImproving(false);
      }
    }, 1000);
  };

  const applyImprovementRules = (text: string, context?: string): string => {
    let improved = text;

    // 1. Correções básicas de português
    improved = improved
      .replace(/\bvc\b/gi, 'você')
      .replace(/\bpq\b/gi, 'porque')
      .replace(/\btb\b/gi, 'também')
      .replace(/\bqd\b/gi, 'quando')
      .replace(/\bmto\b/gi, 'muito')
      .replace(/\bfzr\b/gi, 'fazer')
      .replace(/\bmsm\b/gi, 'mesmo')
      .replace(/\bdps\b/gi, 'depois')
      .replace(/\bnao\b/gi, 'não')
      .replace(/\bestao\b/gi, 'estão')
      .replace(/\btao\b/gi, 'tão');

    // 2. Estruturação técnica
    if (!improved.includes('PROBLEMA:') && !improved.includes('ERRO:')) {
      const sections = extractSections(improved);
      improved = formatTechnicalStructure(sections, context);
    }

    // 3. Melhorias de clareza
    improved = improveClarityAndTone(improved);

    // 4. Formatação final
    improved = finalFormatting(improved);

    return improved;
  };

  const extractSections = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    
    return {
      problem: findProblemDescription(lines),
      steps: findStepsToReproduce(lines),
      expected: findExpectedBehavior(lines),
      actual: findActualBehavior(lines),
      additional: findAdditionalInfo(lines)
    };
  };

  const findProblemDescription = (lines: string[]): string => {
    // Busca por indicadores de problema
    const problemIndicators = ['erro', 'problema', 'falha', 'bug', 'não funciona', 'não consegue'];
    const problemLines = lines.filter(line => 
      problemIndicators.some(indicator => line.toLowerCase().includes(indicator))
    );
    return problemLines.join(' ') || lines[0] || '';
  };

  const findStepsToReproduce = (lines: string[]): string => {
    const stepIndicators = ['passo', 'etapa', 'primeiro', 'segundo', 'depois', 'em seguida'];
    const stepLines = lines.filter(line => 
      stepIndicators.some(indicator => line.toLowerCase().includes(indicator))
    );
    return stepLines.join('\n');
  };

  const findExpectedBehavior = (lines: string[]): string => {
    const expectedIndicators = ['deveria', 'esperado', 'era para', 'tinha que'];
    const expectedLines = lines.filter(line => 
      expectedIndicators.some(indicator => line.toLowerCase().includes(indicator))
    );
    return expectedLines.join(' ');
  };

  const findActualBehavior = (lines: string[]): string => {
    const actualIndicators = ['mas', 'porém', 'entretanto', 'acontece que', 'na verdade'];
    const actualLines = lines.filter(line => 
      actualIndicators.some(indicator => line.toLowerCase().includes(indicator))
    );
    return actualLines.join(' ');
  };

  const findAdditionalInfo = (lines: string[]): string => {
    const additionalIndicators = ['sistema', 'versão', 'navegador', 'usuário', 'processo'];
    const additionalLines = lines.filter(line => 
      additionalIndicators.some(indicator => line.toLowerCase().includes(indicator))
    );
    return additionalLines.join('\n');
  };

  const formatTechnicalStructure = (sections: any, context?: string): string => {
    let formatted = '';

    // Cabeçalho do problema
    if (sections.problem) {
      formatted += `**PROBLEMA RELATADO:**\n${sections.problem}\n\n`;
    }

    // Passos para reproduzir
    if (sections.steps) {
      formatted += `**PASSOS PARA REPRODUZIR:**\n${sections.steps}\n\n`;
    }

    // Comportamento esperado vs atual
    if (sections.expected) {
      formatted += `**COMPORTAMENTO ESPERADO:**\n${sections.expected}\n\n`;
    }

    if (sections.actual) {
      formatted += `**COMPORTAMENTO ATUAL:**\n${sections.actual}\n\n`;
    }

    // Informações adicionais
    if (sections.additional) {
      formatted += `**INFORMAÇÕES ADICIONAIS:**\n${sections.additional}\n\n`;
    }

    // Adicionar contexto se fornecido
    if (context) {
      formatted += `**CONTEXTO:**\n${context}\n\n`;
    }

    return formatted.trim();
  };

  const improveClarityAndTone = (text: string): string => {
    let improved = text;

    // Tornar mais formal e técnico
    improved = improved
      .replace(/\btá\b/gi, 'está')
      .replace(/\bnum\b/gi, 'em um')
      .replace(/\bnuma\b/gi, 'em uma')
      .replace(/\bpra\b/gi, 'para')
      .replace(/\bpro\b/gi, 'para o')
      .replace(/\bda pra\b/gi, 'é possível')
      .replace(/\bneh\b/gi, '')
      .replace(/\bne\b/gi, '')
      .replace(/\bmano\b/gi, '')
      .replace(/\bcara\b/gi, '');

    // Adicionar palavras técnicas apropriadas
    improved = improved
      .replace(/\bnão funciona\b/gi, 'apresenta falha')
      .replace(/\bnão abre\b/gi, 'não carrega corretamente')
      .replace(/\bdeu erro\b/gi, 'gerou erro')
      .replace(/\btravou\b/gi, 'ficou sem resposta')
      .replace(/\bbugo\b/gi, 'erro no sistema');

    return improved;
  };

  const finalFormatting = (text: string): string => {
    return text
      .replace(/\s+/g, ' ') // Remove espaços extras
      .replace(/\n\s*\n/g, '\n\n') // Remove linhas vazias extras
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Espaço após pontuação
      .trim();
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
      {isImproving ? 'Melhorando...' : 'Melhorar Texto'}
    </Button>
  );
};

export default DescriptionImprover;
