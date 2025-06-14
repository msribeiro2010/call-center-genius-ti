
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

  // Agrupar assuntos por categoria
  const assuntosPorCategoria = useMemo(() => {
    return assuntos.reduce((acc, assunto) => {
      const categoria = assunto.categoria || 'Outros';
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(assunto);
      return acc;
    }, {} as Record<string, Assunto[]>);
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
