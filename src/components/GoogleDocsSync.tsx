
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Download, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface SyncResult {
  name: string;
  action: 'created' | 'updated' | 'skipped' | 'error';
  error?: string;
}

const GoogleDocsSync = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isCheckingConfig, setIsCheckingConfig] = useState(false);
  const [configStatus, setConfigStatus] = useState<'checking' | 'ready' | 'missing'>('checking');
  const { toast } = useToast();

  React.useEffect(() => {
    checkGoogleConfig();
  }, []);

  const checkGoogleConfig = async () => {
    setIsCheckingConfig(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-docs-sync', {
        body: { action: 'check_config' }
      });

      if (error || data?.error) {
        setConfigStatus('missing');
      } else {
        setConfigStatus('ready');
      }
    } catch (error) {
      setConfigStatus('missing');
    } finally {
      setIsCheckingConfig(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (configStatus !== 'ready') {
      toast({
        title: "Configuração pendente",
        description: "Configure o Google Client ID primeiro",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('google-docs-sync', {
        body: { action: 'get_auth_url' }
      });

      if (error || data?.error) {
        throw new Error(data?.error || 'Erro ao obter URL de autenticação');
      }

      const authUrl = data.authUrl;
      
      // Abrir popup para autenticação
      const popup = window.open(authUrl, 'google-auth', 'width=500,height=600');
      
      // Monitorar mudanças na URL do popup
      const checkClosed = setInterval(() => {
        try {
          if (popup?.closed) {
            clearInterval(checkClosed);
            toast({
              title: "Autenticação cancelada",
              description: "A janela de autenticação foi fechada",
              variant: "destructive"
            });
          }
          
          if (popup?.location?.hash) {
            const hash = popup.location.hash;
            const token = hash.match(/access_token=([^&]*)/)?.[1];
            
            if (token) {
              setAccessToken(token);
              setIsAuthenticated(true);
              popup.close();
              clearInterval(checkClosed);
              
              toast({
                title: "Autenticado com sucesso!",
                description: "Agora você pode sincronizar seus Google Docs"
              });
            }
          }
        } catch (e) {
          // Ignorar erros de cross-origin
        }
      }, 1000);

    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast({
        title: "Erro na autenticação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  };

  const handleSyncDocs = async () => {
    if (!accessToken) {
      toast({
        title: "Erro",
        description: "Você precisa se autenticar primeiro",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    setSyncResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('google-docs-sync', {
        body: { 
          action: 'sync_docs',
          accessToken: accessToken
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setSyncResults(data.results || []);
      setLastSync(new Date());
      
      const created = data.results?.filter((r: SyncResult) => r.action === 'created').length || 0;
      const updated = data.results?.filter((r: SyncResult) => r.action === 'updated').length || 0;
      
      toast({
        title: "Sincronização concluída!",
        description: `${created} documentos criados, ${updated} atualizados de ${data.total} total`
      });

    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'updated': return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'skipped': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getActionBadge = (action: string) => {
    const variants = {
      'created': 'default',
      'updated': 'secondary',
      'skipped': 'outline',
      'error': 'destructive'
    } as const;

    return (
      <Badge variant={variants[action as keyof typeof variants] || 'outline'}>
        {action === 'created' ? 'Criado' :
         action === 'updated' ? 'Atualizado' :
         action === 'skipped' ? 'Ignorado' :
         action === 'error' ? 'Erro' : action}
      </Badge>
    );
  };

  if (isCheckingConfig) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Verificando configuração...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {configStatus === 'missing' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-orange-600 mx-auto" />
              <div>
                <h3 className="font-medium text-orange-900 mb-2">Configuração Necessária</h3>
                <p className="text-sm text-orange-700 mb-4">
                  Para usar a sincronização do Google Docs, você precisa configurar o Google Client ID.
                </p>
                <p className="text-xs text-orange-600 mb-4">
                  Use o Client ID que você acabou de gerar no Google Cloud Console.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sincronização Google Docs
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Importe seus documentos do Google Docs para a base de conhecimento do ChatBot
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {configStatus === 'ready' && !isAuthenticated ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-green-900 mb-2">Configuração OK</h3>
                <p className="text-sm text-green-700">
                  A configuração do Google está pronta. Clique no botão abaixo para autenticar.
                </p>
              </div>
              <Button onClick={handleGoogleAuth}>
                <Download className="h-4 w-4 mr-2" />
                Autenticar com Google
              </Button>
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Autenticado com sucesso</span>
                </div>
                <Button 
                  onClick={handleSyncDocs}
                  disabled={isSyncing}
                  className="flex items-center gap-2"
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar Documentos'}
                </Button>
              </div>

              {lastSync && (
                <p className="text-sm text-muted-foreground">
                  Última sincronização: {lastSync.toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          ) : configStatus === 'missing' ? (
            <div className="text-center">
              <Button disabled variant="outline">
                <AlertCircle className="h-4 w-4 mr-2" />
                Configure o Google Client ID primeiro
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {syncResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Sincronização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {syncResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActionIcon(result.action)}
                    <span className="text-sm">{result.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getActionBadge(result.action)}
                    {result.error && (
                      <span className="text-xs text-red-600" title={result.error}>
                        {result.error.substring(0, 30)}...
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoogleDocsSync;
