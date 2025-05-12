
import { useAuth } from '@/context/AuthContext';

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const { user } = useAuth();
  const currentDateTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <p className="mt-2 md:mt-0 text-sm text-gray-500">
          {currentDateTime}
        </p>
      </div>
      {user && (
        <p className="mt-2 text-sm text-gray-500">
          Welcome, {user.name} ({user.role})
        </p>
      )}
    </div>
  );
}
