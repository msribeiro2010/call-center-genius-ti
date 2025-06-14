
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
    // Extrair os últimos 4 dígitos do processo
    const match = numeroProcesso.match(/(\d{4})$/);
    if (match) {
      const codigoOJ = match[1];
      
      // Se o usuário selecionou um grau específico, usar apenas esse grau
      if (grauSelecionado === '1') {
        // Buscar apenas nos OJs do 1º grau
        const oj1Grau = primeiroGrauOJs.find(oj => oj.codigo === codigoOJ);
        if (oj1Grau) {
          const newOjData = {
            grau: '1',
            orgaoJulgador: codigoOJ,
            ojDetectada: oj1Grau.nome
          };
          setOjData(newOjData);
          return newOjData;
        } else {
          const notFoundData = {
            grau: '1',
            orgaoJulgador: '',
            ojDetectada: 'OJ não encontrada para o código: ' + codigoOJ
          };
          setOjData(notFoundData);
          return notFoundData;
        }
      } else if (grauSelecionado === '2') {
        // Se selecionou 2º grau, não fazer detecção automática
        const emptyData = { grau: '2', orgaoJulgador: '', ojDetectada: '' };
        setOjData(emptyData);
        return emptyData;
      } else {
        // Lógica original quando não há grau selecionado
        // Buscar nos OJs do 1º grau primeiro
        const oj1Grau = primeiroGrauOJs.find(oj => oj.codigo === codigoOJ);
        if (oj1Grau) {
          const newOjData = {
            grau: '1',
            orgaoJulgador: codigoOJ,
            ojDetectada: oj1Grau.nome
          };
          setOjData(newOjData);
          return newOjData;
        }
        
        // Buscar nos OJs do 2º grau
        const oj2Grau = segundoGrauOJs.find(oj => oj.codigo === codigoOJ);
        if (oj2Grau) {
          const newOjData = {
            grau: '2',
            orgaoJulgador: codigoOJ,
            ojDetectada: oj2Grau.nome
          };
          setOjData(newOjData);
          return newOjData;
        }
        
        // Se não encontrou
        const notFoundData = {
          grau: '',
          orgaoJulgador: '',
          ojDetectada: 'OJ não encontrada para o código: ' + codigoOJ
        };
        setOjData(notFoundData);
        return notFoundData;
      }
    } else {
      const emptyData = { grau: grauSelecionado || '', orgaoJulgador: '', ojDetectada: '' };
      setOjData(emptyData);
      return emptyData;
    }
  };

  const clearOJData = () => {
    setOjData({ grau: '', orgaoJulgador: '', ojDetectada: '' });
  };

  return {
    ojData,
    detectarOJ,
    clearOJData
  };
};
