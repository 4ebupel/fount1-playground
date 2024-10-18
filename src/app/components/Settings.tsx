'use client';

import { useState } from 'react';
import SettingsSidebar from '../components/SettingsSidebar';
import ProfileSettings from '../components/ProfileSettings';
import CompanyDetails from '../components/CompanyDetails';
import BillingDetails from '../components/BillingDetails';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('companyDetails');

  return (
    <div className="flex flex-1">
      {/* Left Sidebar */}
      <SettingsSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="max-w-3xl mx-auto p-8">
          {activeSection === 'profile' && <ProfileSettings />}
          {activeSection === 'companyDetails' && <CompanyDetails />}
          {activeSection === 'billingDetails' && <BillingDetails />}
        </div>
      </div>
    </div>
  );
}
