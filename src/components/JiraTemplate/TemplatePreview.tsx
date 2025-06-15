
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TemplatePreviewProps {
  templateContent: string;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ templateContent }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-blue-700">Preview do Template Completo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {templateContent}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplatePreview;
