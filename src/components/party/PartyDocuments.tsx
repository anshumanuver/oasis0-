
import { useState } from 'react';
import { Document } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, FileX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PartyDocumentsProps {
  documents: Document[];
  caseId?: string;
}

export default function PartyDocuments({ documents, caseId }: PartyDocumentsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Mock function to upload document
  const handleUpload = () => {
    if (!selectedFile) return;
    
    // In a real application, this would call an API to upload the file
    console.log('Uploading file:', selectedFile.name);
    setSelectedFile(null);
    
    // Reset the file input
    const fileInput = document.getElementById('document-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Case Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-500 mb-4">Upload documents related to your case here</p>
            <div className="mt-2">
              <input
                id="document-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="document-upload">
                <Button variant="outline" className="mb-2 cursor-pointer" asChild>
                  <span><Upload className="h-4 w-4 mr-2" /> Select File</span>
                </Button>
              </label>
              {selectedFile && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                  <Button onClick={handleUpload} className="mt-2">
                    <FileText className="h-4 w-4 mr-2" /> Upload Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Case Documents</span>
          <input
            id="document-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="document-upload">
            <Button variant="outline" size="sm" className="cursor-pointer" asChild>
              <span><Upload className="h-4 w-4 mr-1" /> Upload</span>
            </Button>
          </label>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedFile && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
              <Button size="sm" onClick={handleUpload}>Upload</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex justify-between items-center p-3 bg-white rounded-md border border-gray-200">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{formatFileSize(doc.size)}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                  <FileX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
