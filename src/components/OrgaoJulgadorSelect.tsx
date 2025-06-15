
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { primeiroGrauOJs, segundoGrauOJs } from '@/data';

interface OrgaoJulgadorSelectProps {
  grau: string;
  value: string;
  onValueChange: (value: string) => void;
  onOJDetected: (ojNome: string) => void;
}

const OrgaoJulgadorSelect: React.FC<OrgaoJulgadorSelectProps> = ({
  grau,
  value,
  onValueChange,
  onOJDetected
}) => {
  const handleValueChange = (selectedValue: string) => {
    onValueChange(selectedValue);
    
    // Detectar o nome da OJ baseado no grau e código selecionado
    let ojNome = '';
    if (grau === '1') {
      const oj = primeiroGrauOJs.find(oj => oj.codigo === selectedValue);
      ojNome = oj ? oj.nome : '';
    } else if (grau === '2') {
      const oj = segundoGrauOJs.find(oj => oj.codigo === selectedValue);
      ojNome = oj ? oj.nome : '';
    }
    
    onOJDetected(ojNome);
  };

  // Determinar quais OJs mostrar baseado no grau
  let ojs = [];
  if (grau === '1') {
    ojs = primeiroGrauOJs;
  } else if (grau === '2') {
    ojs = segundoGrauOJs;
  }

  if (!grau) {
    return (
      <Select disabled>
        <SelectTrigger className="border-gray-300">
          <SelectValue placeholder="Selecione o grau primeiro" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-grau-selected">Selecione o grau primeiro</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
        <SelectValue placeholder={`Selecione o órgão do ${grau}º grau`} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {ojs.map((oj) => (
          <SelectItem key={oj.codigo} value={oj.codigo}>
            {oj.codigo} - {oj.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrgaoJulgadorSelect;
