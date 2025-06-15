
import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Assunto {
  id: string;
  nome: string;
  categoria: string;
}

interface SearchableAssuntoSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  assuntos: Assunto[];
  loading?: boolean;
  placeholder?: string;
}

const SearchableAssuntoSelect: React.FC<SearchableAssuntoSelectProps> = ({
  value,
  onValueChange,
  assuntos,
  loading = false,
  placeholder = "Selecione ou digite para buscar assunto..."
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Debug detalhado
  console.log('=== SearchableAssuntoSelect DEBUG ===');
  console.log('Loading:', loading);
  console.log('Assuntos recebidos:', assuntos?.length || 0);
  console.log('Value atual:', value);
  console.log('Assuntos (primeiros 3):', assuntos?.slice(0, 3));

  // Agrupar assuntos por categoria
  const assuntosPorCategoria = useMemo(() => {
    console.log('Agrupando', assuntos.length, 'assuntos por categoria...');
    
    if (!Array.isArray(assuntos) || assuntos.length === 0) {
      console.log('Array de assuntos vazio ou inválido');
      return {};
    }

    const grouped = assuntos.reduce((acc, assunto) => {
      if (!assunto || !assunto.nome) {
        console.warn('Assunto inválido encontrado:', assunto);
        return acc;
      }
      
      const categoria = assunto.categoria || 'Outros';
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(assunto);
      return acc;
    }, {} as Record<string, Assunto[]>);

    console.log('Agrupamento concluído:', Object.keys(grouped).length, 'categorias');
    console.log('Categorias:', Object.keys(grouped));
    
    return grouped;
  }, [assuntos]);

  // Filtrar assuntos baseado na busca
  const filteredCategorias = useMemo(() => {
    if (!searchValue.trim()) {
      return assuntosPorCategoria;
    }

    const searchLower = searchValue.toLowerCase();
    const filtered: Record<string, Assunto[]> = {};

    Object.entries(assuntosPorCategoria).forEach(([categoria, assuntosCategoria]) => {
      const assuntosFiltrados = assuntosCategoria.filter(assunto =>
        assunto.nome.toLowerCase().includes(searchLower) ||
        categoria.toLowerCase().includes(searchLower)
      );

      if (assuntosFiltrados.length > 0) {
        filtered[categoria] = assuntosFiltrados;
      }
    });

    return filtered;
  }, [assuntosPorCategoria, searchValue]);

  const selectedAssunto = assuntos.find(assunto => assunto.id === value);

  if (loading) {
    console.log('Renderizando estado de loading...');
    return (
      <Button
        variant="outline"
        className="w-full justify-between"
        disabled
      >
        Carregando assuntos...
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (!assuntos || assuntos.length === 0) {
    console.log('Renderizando estado sem assuntos...');
    return (
      <Button
        variant="outline"
        className="w-full justify-between"
        disabled
      >
        Nenhum assunto encontrado
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  console.log('Renderizando select normal com', assuntos.length, 'assuntos');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {selectedAssunto ? selectedAssunto.nome : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Digite para buscar assunto..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>Nenhum assunto encontrado.</CommandEmpty>
            {Object.entries(filteredCategorias).map(([categoria, assuntosCategoria]) => (
              <CommandGroup key={categoria} heading={categoria}>
                {assuntosCategoria.map((assunto) => (
                  <CommandItem
                    key={assunto.id}
                    value={assunto.nome}
                    onSelect={() => {
                      console.log('Assunto selecionado:', assunto);
                      onValueChange(assunto.id);
                      setOpen(false);
                      setSearchValue('');
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === assunto.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {assunto.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableAssuntoSelect;
