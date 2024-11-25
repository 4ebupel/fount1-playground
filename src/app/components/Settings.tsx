'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '../contexts/UserContext';
import SettingsSidebar from '../components/SettingsSidebar';
import ProfileSettings from '../components/ProfileSettings';
import CompanyDetails from '../components/CompanyDetails';
import BillingDetails from '../components/BillingDetails';

export default function Settings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData } = useUser();
  const [activeSection, setActiveSection] = useState(searchParams.get('tab') || 'profile');

  // Redirect non-admin users if they try to access restricted sections
  useEffect(() => {
    const tab = searchParams.get('tab');
    const isAdmin = userData?.employer_profile?.role?.name === 'admin';
    const restrictedTabs = ['companyDetails', 'billingDetails'];

    if (!isAdmin && restrictedTabs.includes(tab || '')) {
      router.push('/settings?tab=profile');
    }
  }, [searchParams, userData?.employer_profile?.role?.name, router]);

  // Update URL when tab changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    router.push(`/settings?tab=${section}`, { scroll: false });
  };

  // Sync with URL params when they change externally
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveSection(tab);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-1">
      <SettingsSidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
      />

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
