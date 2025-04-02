'use client';

import { useUserStore } from '@/src/store/userStore';
import { Button } from '@/src/components/ui/button';

export default function LogoutButton() {
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    alert('You have been logged out.');
  };

  return (
    <Button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded-md">
      Logout
    </Button>
  );
}