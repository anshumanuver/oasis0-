
export interface Document {
  id: string;
  case_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  description?: string;
  uploaded_by: string;
  created_at: string;
}
