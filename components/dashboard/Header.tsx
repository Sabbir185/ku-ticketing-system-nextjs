
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/types/tickets';
import { Badge } from '../ui/badge';
interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'employee': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <Badge variant={getRoleBadgeVariant(user?.role)}>
            {user?.role.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
          <Button variant="outline" className='cursor-pointer' onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;