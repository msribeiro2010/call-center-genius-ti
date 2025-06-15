
import React from 'react';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';

interface CopyFieldProps {
  label: string;
  value: string;
  className?: string;
  onCopy: (value: string, label: string) => void;
}

const CopyField: React.FC<CopyFieldProps> = ({ label, value, className = "", onCopy }) => (
  <div className={`flex items-center justify-between p-3 bg-muted rounded-lg ${className}`}>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-sm break-words">{value || 'N/A'}</p>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onCopy(value || '', label)}
      className="ml-2 p-2"
    >
      <Copy className="h-4 w-4" />
    </Button>
  </div>
);

export default CopyField;
