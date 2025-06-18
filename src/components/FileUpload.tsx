
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Upload, X, File, FileText, FileImage, FileType } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface FileUploadProps {
  onFileUploaded: (filePath: string) => void;
  currentFile?: string;
  onFileRemoved: () => void;
  label?: string;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  currentFile,
  onFileRemoved,
  label = "Arquivo",
  accept = "image/*,.pdf,.txt,.rtf,.csv"
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'txt':
      case 'rtf':
        return <FileType className="h-4 w-4 text-blue-500" />;
      case 'csv':
        return <File className="h-4 w-4 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <FileImage className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const validateFile = (file: File): boolean => {
    // Validar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive"
      });
      return false;
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain',
      'text/rtf',
      'application/rtf',
      'text/csv',
      'application/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Erro",
        description: "Tipo de arquivo não suportado. Use: PDF, TXT, RTF, CSV ou imagens",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('knowledge-base-files')
        .upload(filePath, file);

      if (error) throw error;

      onFileUploaded(data.path);
      
      toast({
        title: "Sucesso!",
        description: "Arquivo enviado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do arquivo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async () => {
    if (!currentFile) return;

    try {
      const { error } = await supabase.storage
        .from('knowledge-base-files')
        .remove([currentFile]);

      if (error) throw error;

      onFileRemoved();
      
      toast({
        title: "Sucesso!",
        description: "Arquivo removido com sucesso"
      });
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover arquivo",
        variant: "destructive"
      });
    }
  };

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('knowledge-base-files')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const getFileName = (filePath: string) => {
    return filePath.split('/').pop() || 'Arquivo';
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {currentFile ? (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getFileIcon(currentFile)}
              <span className="text-sm text-gray-700">{getFileName(currentFile)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(getFileUrl(currentFile), '_blank')}
              >
                Ver
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {currentFile.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
            <div className="mt-2">
              <img 
                src={getFileUrl(currentFile)} 
                alt="Preview" 
                className="max-w-xs max-h-32 object-cover rounded border"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm text-gray-600">
                Clique para fazer upload ou arraste um arquivo
              </span>
              <Input
                id="file-upload"
                type="file"
                accept={accept}
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              PDF, TXT, RTF, CSV, PNG, JPG, GIF até 10MB
            </p>
          </div>
        </div>
      )}
      
      {uploading && (
        <div className="text-sm text-blue-600">
          Enviando arquivo...
        </div>
      )}
    </div>
  );
};

export default FileUpload;
