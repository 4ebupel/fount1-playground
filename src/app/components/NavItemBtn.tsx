import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

type NavItemBtnProps = {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
};

export default function NavItemBtn({ icon, label, isActive = false, onClick }: NavItemBtnProps) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start mb-1 ${isActive ? 'bg-gray-100 text-blue-600' : ''}`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
}
