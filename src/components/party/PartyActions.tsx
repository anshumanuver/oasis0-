
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Calendar, User } from 'lucide-react';

export default function PartyActions() {
  return (
    <div className="space-y-4">
      <Button variant="outline" className="w-full justify-start">
        <FileText className="h-5 w-5 mr-2" />
        Upload Documents
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <MessageSquare className="h-5 w-5 mr-2" />
        Contact Mediator
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Calendar className="h-5 w-5 mr-2" />
        Request Hearing
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <User className="h-5 w-5 mr-2" />
        Update Profile
      </Button>
    </div>
  );
}
