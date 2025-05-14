
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface DocumentUploadParams {
  file: File;
  caseId: string;
  userId: string;
}

export interface DocumentDeleteParams {
  documentId: string;
  filePath: string;
}

const BUCKET_NAME = 'case-documents';

// Initialize the storage bucket if it doesn't exist
export const initDocumentStorage = async () => {
  // Check if the bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
  
  // Create the bucket if it doesn't exist
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
      fileSizeLimit: 50_000_000, // 50MB limit
    });

    if (error) {
      console.error('Error creating document storage bucket:', error);
      return false;
    }
  }
  
  return true;
};

export const uploadDocument = async ({ file, caseId, userId }: DocumentUploadParams) => {
  try {
    // Ensure storage is initialized
    await initDocumentStorage();
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${caseId}/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the file URL
    const { data: fileData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
      
    // Insert record in the documents table
    const { data, error } = await supabase
      .from('documents')
      .insert({
        case_id: caseId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: userId,
        description: file.name
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const downloadDocument = async (filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

export const deleteDocument = async ({ documentId, filePath }: DocumentDeleteParams) => {
  try {
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);
      
    if (storageError) {
      throw storageError;
    }
    
    // Delete the document record
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
      
    if (dbError) {
      throw dbError;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const getCaseDocuments = async (caseId: string) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching case documents:', error);
    throw error;
  }
};

export const getAllUserDocuments = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*, cases!inner(*)')
      .eq('uploaded_by', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }
};
