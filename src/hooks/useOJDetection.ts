
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

  const detectarOJ = (numeroProcesso: string) => {
    // Extrair os últimos 4 dígitos do processo
    const match = numeroProcesso.match(/(\d{4})$/);
    if (match) {
      const codigoOJ = match[1];
      
      // Buscar nos OJs do 1º grau
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
    } else {
      const emptyData = { grau: '', orgaoJulgador: '', ojDetectada: '' };
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
