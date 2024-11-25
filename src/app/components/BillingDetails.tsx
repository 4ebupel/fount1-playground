import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/components/navigation';
import getCompany from '../api/getCompany';
import type { Company } from '../types/Company';
import type { BillingDetails } from '../types/BillingDetails';
import Skeleton from 'react-loading-skeleton';
import { ErrorMessage } from './ErrorMessage';
import { Button } from '@/components/ui/button';

export default function BillingDetails() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    id: 0,
    company_id: '',
    billing_email: '',
    billing_address: '',
    contact_person: '',
    payment_method: 'creditCard',
    tax_id: '',
  });
  const [isSameAddress, setIsSameAddress] = useState(true);
  const { userData } = useUser();
  const router = useRouter();

  const fetchCompany = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const companyId = userData?.employer_profile?.companies[0]?.id;
      if (!companyId) {
        throw new Error('No company ID found');
      }

      const company = await getCompany(companyId.toString());
      if (!company) {
        throw new Error('Failed to fetch company data');
      }

      if (!company.billing_details) {
        const response = await fetch('/api/initializeCompanyBillingDetails', {
          method: 'POST',
          body: JSON.stringify({ company_id: companyId }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message);
        }
      }

      setCompanyData(company);
      if (company.billing_details) {
        setBillingDetails(company.billing_details);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error fetching company:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.employer_profile?.role?.name !== 'admin') {
      router.push('/settings?tab=profile');
    }

    fetchCompany();
  }, [userData?.employer_profile?.role?.name, router, fetchCompany]);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/updateCompanyBillingDetails', {
        method: 'POST',
        // eslint-disable-next-line max-len
        body: JSON.stringify({ company_id: companyData?.id, billing_email: billingDetails.billing_email, billing_address: billingDetails.billing_address, contact_person: billingDetails.contact_person, tax_id: billingDetails.tax_id, payment_method: billingDetails.payment_method }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message);
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  const hasFormChanged = () => {
    if (!companyData?.billing_details) {
      return false;
    }

    return Object.keys(billingDetails).some(
      (key) => billingDetails[key as keyof BillingDetails] !== companyData.billing_details[key as keyof BillingDetails]
    );
  }

  if (userData?.employer_profile?.role?.name !== 'admin') {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing Details</h1>

      {error && <ErrorMessage error={error} setError={setError} />}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <Checkbox
              id="same-address"
              checked={isSameAddress}
              onCheckedChange={() => {
                setIsSameAddress(!isSameAddress);
                setBillingDetails((prev) => ({
                  ...prev,
                  billing_address: companyData?.billing_address || prev.billing_address,
                }));
              }}
            />
            <label htmlFor="same-address" className="ml-2">
              Billing address is the same as a company address
            </label>
          </div>
          <div className={`flex flex-col gap-2 ${isSameAddress ? 'hidden' : ''}`}>
            <Label htmlFor="billing-address">Billing Address</Label>
            {isLoading ? <Skeleton className="h-10 w-full" /> : (
              <Input
                id="billing-address"
                value={billingDetails.billing_address || ''}
                onChange={(e) => setBillingDetails((prev) => ({
                  ...prev,
                  billing_address: e.target.value,
                }))}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="billing-email">Billing Email</Label>
            {isLoading ? <Skeleton className="h-10 w-full" /> : (
              <Input
                id="billing-email"
                type="email"
                value={billingDetails.billing_email || ''}
                onChange={(e) => setBillingDetails((prev) => ({
                  ...prev,
                  billing_email: e.target.value,
                }))}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="billing-name">Contact Person</Label>
            {isLoading ? <Skeleton className="h-10 w-full" /> : (
              <Input
                id="billing-name"
                value={billingDetails.contact_person || ''}
                onChange={(e) => setBillingDetails((prev) => ({
                  ...prev,
                  contact_person: e.target.value,
                }))}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tax-id">Tax ID</Label>
            {isLoading ? <Skeleton className="h-10 w-full" /> : (
              <Input
                id="tax-id"
                value={billingDetails.tax_id || ''}
                onChange={(e) => setBillingDetails((prev) => ({
                  ...prev,
                  tax_id: e.target.value,
                }))}
              />
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
        <div className="space-y-4">
          <div>
            <Label>Select Payment Method</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="credit-card"
                  name="payment-method"
                  className="mr-2"
                  checked={billingDetails.payment_method === 'creditCard'}
                  onChange={() => setBillingDetails((prev) => ({
                    ...prev,
                    payment_method: 'creditCard',
                  }))}
                />
                <label htmlFor="credit-card">Credit Card</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="payment-method"
                  className="mr-2"
                  checked={billingDetails.payment_method === 'payPal'}
                  onChange={() => setBillingDetails((prev) => ({
                    ...prev,
                    payment_method: 'payPal',
                  }))}
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="bank-transfer"
                  name="payment-method"
                  className="mr-2"
                  checked={billingDetails.payment_method === 'bankTransfer'}
                  onChange={() => setBillingDetails((prev) => ({
                    ...prev,
                    payment_method: 'bankTransfer',
                  }))}
                />
                <label htmlFor="bank-transfer">Bank Transfer</label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center mt-6">
        <Button 
          type="submit" 
          className="w-full"
          size="lg"
          disabled={isLoading || !hasFormChanged()}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}