
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Calendar, User, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PartyActions() {
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [requesting, setRequesting] = useState(false);

  // Mock document upload function
  const handleUploadDocument = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf,image/*,.doc,.docx';
    
    fileInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        setUploading(true);
        
        // Simulate upload process
        setTimeout(() => {
          setUploading(false);
          toast.success('Document uploaded successfully', {
            description: `File "${target.files?.[0].name}" has been uploaded.`
          });
        }, 1500);
      }
    });
    
    fileInput.click();
  };

  // Mock contact mediator function
  const handleContactMediator = () => {
    setSending(true);
    
    // Simulate message sending process
    setTimeout(() => {
      setSending(false);
      toast.success('Message sent successfully', {
        description: 'Your mediator will respond shortly.'
      });
    }, 1000);
  };

  // Mock request hearing function
  const handleRequestHearing = () => {
    setRequesting(true);
    
    // Simulate hearing request process
    setTimeout(() => {
      setRequesting(false);
      toast.success('Hearing requested successfully', {
        description: 'You will be notified when the hearing is scheduled.'
      });
    }, 1200);
  };

  // Mock update profile function
  const handleUpdateProfile = () => {
    window.location.href = '/profile';
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        disabled={uploading}
        onClick={handleUploadDocument}
      >
        {uploading ? (
          <>
            <AlertCircle className="h-5 w-5 mr-2 animate-pulse text-yellow-500" />
            Uploading...
          </>
        ) : (
          <>
            <FileText className="h-5 w-5 mr-2" />
            Upload Documents
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full justify-start"
        disabled={sending}
        onClick={handleContactMediator}
      >
        {sending ? (
          <>
            <AlertCircle className="h-5 w-5 mr-2 animate-pulse text-yellow-500" />
            Sending...
          </>
        ) : (
          <>
            <MessageSquare className="h-5 w-5 mr-2" />
            Contact Mediator
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full justify-start"
        disabled={requesting}
        onClick={handleRequestHearing}
      >
        {requesting ? (
          <>
            <AlertCircle className="h-5 w-5 mr-2 animate-pulse text-yellow-500" />
            Requesting...
          </>
        ) : (
          <>
            <Calendar className="h-5 w-5 mr-2" />
            Request Hearing
          </>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={handleUpdateProfile}
      >
        <User className="h-5 w-5 mr-2" />
        Update Profile
      </Button>
    </div>
  );
}
