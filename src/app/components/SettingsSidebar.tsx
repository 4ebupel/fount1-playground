import { User, Building, CreditCard } from 'lucide-react';
import NavItemBtn from './NavItemBtn';

type SidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

export default function SettingsSidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-sm h-full">
      <div className="p-4 border-b flex items-center space-x-2">
        <div className="w-8 h-8 bg-purple-600 rounded-md" />
        <h2 className="text-xl font-semibold">fount.one</h2>
      </div>
      <nav className="p-4">
        <NavItemBtn
          icon={<User size={18} />}
          label="Profile Settings"
          isActive={activeSection === 'profile'}
          onClick={() => setActiveSection('profile')}
        />

        <div className="mt-6 mb-2">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Company Account</h3>
        </div>
        <NavItemBtn
          icon={<Building size={18} />}
          label="Company Details"
          isActive={activeSection === 'companyDetails'}
          onClick={() => setActiveSection('companyDetails')}
        />
        <NavItemBtn
          icon={<CreditCard size={18} />}
          label="Billing Details"
          isActive={activeSection === 'billingDetails'}
          onClick={() => setActiveSection('billingDetails')}
        />
      </nav>
    </div>
  );
}
