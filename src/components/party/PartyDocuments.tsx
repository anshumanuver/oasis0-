
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Document } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download, FileX, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  uploadDocument, 
  downloadDocument, 
  deleteDocument, 
  getCaseDocuments, 
  getAllUserDocuments 
} from '@/services/documentService';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface PartyDocumentsProps {
  caseId?: string;
}

export default function PartyDocuments({ caseId }: PartyDocumentsProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fetch documents based on whether we have a caseId or not
  const { data: documents = [], isLoading } = useQuery({
    queryKey: caseId ? ['documents', caseId] : ['documents', 'all', user?.id],
    queryFn: () => caseId 
      ? getCaseDocuments(caseId)
      : (user?.id ? getAllUserDocuments(user.id) : Promise.resolve([])),
    enabled: !!user
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload mutation
  const { mutate: uploadFileMutation } = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      toast.success('Document uploaded successfully');
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      // Reset file input
      const fileInput = document.getElementById('document-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      // Refresh documents list
      queryClient.invalidateQueries({ 
        queryKey: caseId ? ['documents', caseId] : ['documents', 'all', user?.id]
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
      setIsUploading(false);
      setUploadProgress(0);
    }
  });

  // Delete mutation
  const { mutate: deleteFileMutation } = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success('Document deleted successfully');
      // Refresh documents list
      queryClient.invalidateQueries({ 
        queryKey: caseId ? ['documents', caseId] : ['documents', 'all', user?.id]
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  });

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !user?.id) return;

    try {
      setIsUploading(true);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Upload the document
      uploadFileMutation({
        file: selectedFile,
        caseId: caseId || 'general',
        userId: user.id
      });
      
      // Clear the progress interval
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle download
  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const blob = await downloadDocument(filePath);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  // Handle delete
  const handleDelete = (documentId: string, filePath: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteFileMutation({ documentId, filePath });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Case Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orrr-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                  <Button 
                    onClick={handleUpload} 
                    className="mt-2"
                    disabled={isUploading}>
                    <FileText className="h-4 w-4 mr-2" /> 
                    {isUploading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                  {isUploading && (
                    <Progress value={uploadProgress} className="h-2 mt-2" />
                  )}
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
            <Button variant="outline" size="sm" className="cursor-pointer" asChild disabled={isUploading}>
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
              <Button 
                size="sm" 
                onClick={handleUpload}
                disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {isUploading && (
              <Progress value={uploadProgress} className="h-2 mt-2" />
            )}
          </div>
        )}

        <div className="space-y-3">
          {documents.map((doc: any) => (
            <div key={doc.id} className="flex justify-between items-center p-3 bg-white rounded-md border border-gray-200">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium">{doc.file_name}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{formatFileSize(doc.file_size)}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDownload(doc.file_path, doc.file_name)}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(doc.id, doc.file_path)}>
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
