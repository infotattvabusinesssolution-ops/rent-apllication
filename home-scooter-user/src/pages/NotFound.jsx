import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center p-6">
      <div className="space-y-4 max-w-md">
        <h1 className="text-6xl font-black text-blue-600">404</h1>
        <h2 className="text-2xl font-black text-slate-900">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The page or marketplace listing you are looking for might have been moved or removed.
        </p>
        <Button icon={Home} onClick={() => navigate('/')} size="lg">
          Back to Homepage
        </Button>
      </div>
    </div>
  );
};
