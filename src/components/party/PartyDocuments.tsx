
import { Document } from '@/types';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PartyDocumentsProps {
  documents: Document[];
}

export default function PartyDocuments({ documents }: PartyDocumentsProps) {
  if (documents.length === 0) {
    return <div className="text-gray-500 text-center py-4">No documents yet</div>;
  }

  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50">
          <div className="bg-blue-100 p-2 rounded">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
          </div>
          {doc.url && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
