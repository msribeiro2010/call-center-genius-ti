
import { useState } from 'react';
import { primeiroGrauOJs, segundoGrauOJs } from '@/data';

export interface OJData {
  grau: string;
  orgaoJulgador: string;
  ojDetectada: string;
}

export const useOJDetection = () => {
  const [ojData, setOjData] = useState<OJData>({
    grau: '',
    orgaoJulgador: '',
    ojDetectada: ''
  });

  const detectarOJ = (numeroProcesso: string, grauSelecionado?: string) => {
    console.log('=== INÍCIO DA DETECÇÃO DE OJ ===');
    console.log('Número do processo:', numeroProcesso);
    console.log('Grau selecionado:', grauSelecionado);
    console.log('Dados de 1º grau carregados:', primeiroGrauOJs.length, 'itens');
    console.log('Dados de 2º grau carregados:', segundoGrauOJs.length, 'itens');
    
    // Extrair os últimos 4 dígitos do processo
    const match = numeroProcesso.match(/(\d{4})$/);
    console.log('Match dos últimos 4 dígitos:', match);
    
    if (match) {
      const codigoOJ = match[1];
      console.log('Código OJ extraído:', codigoOJ);
      
      // Se o usuário selecionou um grau específico, usar apenas esse grau
      if (grauSelecionado === '1') {
        console.log('Buscando OJ no 1º grau...');
        // Buscar apenas nos OJs do 1º grau
        const oj1Grau = primeiroGrauOJs.find(oj => oj.codigo === codigoOJ);
        console.log('OJ encontrada no 1º grau:', oj1Grau);
        
        if (oj1Grau) {
          const newOjData = {
            grau: '1',
            orgaoJulgador: codigoOJ,
            ojDetectada: oj1Grau.nome
          };
          console.log('✅ OJ detectada com sucesso:', newOjData);
          setOjData(newOjData);
          return newOjData;
        } else {
          const notFoundData = {
            grau: '1',
            orgaoJulgador: '',
            ojDetectada: 'OJ não encontrada para o código: ' + codigoOJ
          };
          console.log('❌ OJ não encontrada:', notFoundData);
          setOjData(notFoundData);
          return notFoundData;
        }
      } else if (grauSelecionado === '2') {
        console.log('Grau 2º selecionado - não fazendo detecção automática');
        // Se selecionou 2º grau, não fazer detecção automática
        const emptyData = { grau: '2', orgaoJulgador: '', ojDetectada: '' };
        setOjData(emptyData);
        return emptyData;
      } else {
        console.log('Nenhum grau específico selecionado - buscando em ambos');
        // Lógica original quando não há grau selecionado
        // Buscar nos OJs do 1º grau primeiro
        const oj1Grau = primeiroGrauOJs.find(oj => oj.codigo === codigoOJ);
        console.log('Busca no 1º grau:', oj1Grau);
        
        if (oj1Grau) {
          const newOjData = {
            grau: '1',
            orgaoJulgador: codigoOJ,
            ojDetectada: oj1Grau.nome
          };
          console.log('✅ OJ encontrada no 1º grau:', newOjData);
          setOjData(newOjData);
          return newOjData;
        }
        
        // Buscar nos OJs do 2º grau
        const oj2Grau = segundoGrauOJs.find(oj => oj.codigo === codigoOJ);
        console.log('Busca no 2º grau:', oj2Grau);
        
        if (oj2Grau) {
          const newOjData = {
            grau: '2',
            orgaoJulgador: codigoOJ,
            ojDetectada: oj2Grau.nome
          };
          console.log('✅ OJ encontrada no 2º grau:', newOjData);
          setOjData(newOjData);
          return newOjData;
        }
        
        // Se não encontrou
        const notFoundData = {
          grau: '',
          orgaoJulgador: '',
          ojDetectada: 'OJ não encontrada para o código: ' + codigoOJ
        };
        console.log('❌ OJ não encontrada em nenhum grau:', notFoundData);
        setOjData(notFoundData);
        return notFoundData;
      }
    } else {
      console.log('❌ Não foi possível extrair código OJ do número do processo');
      const emptyData = { grau: grauSelecionado || '', orgaoJulgador: '', ojDetectada: '' };
      setOjData(emptyData);
      return emptyData;
    }
  };

  // Modificar clearOJData para não limpar o grau
  const clearOJData = () => {
    console.log('Limpando dados de OJ...');
    setOjData(prev => ({ 
      grau: prev.grau, // Manter o grau atual
      orgaoJulgador: '', 
      ojDetectada: '' 
    }));
  };

  console.log('Estado atual da OJ:', ojData);

  return {
    ojData,
    detectarOJ,
    clearOJData
  };
};
