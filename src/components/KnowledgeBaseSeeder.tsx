
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Database, Upload } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { seedKnowledgeBase } from '@/utils/knowledgeBaseSeeder';

const KnowledgeBaseSeeder = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await seedKnowledgeBase();
      toast({
        title: "Sucesso!",
        description: "Base de conhecimento populada com sucesso"
      });
    } catch (error) {
      console.error('Erro ao popular base de conhecimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao popular base de conhecimento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Popular Base de Conhecimento
        </CardTitle>
        <CardDescription>
          Adicionar os assuntos padrão do TRT15 na base de conhecimento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleSeedData}
          disabled={loading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {loading ? 'Populando...' : 'Popular Base de Conhecimento'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseSeeder;
