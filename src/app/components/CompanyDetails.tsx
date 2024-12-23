import { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Linkedin,
  Twitter,
  Globe,
  Info,
  X,
  Upload,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUser } from '../contexts/UserContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import { Company } from '../types/Company';
import getCompany from '../api/getCompany';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ErrorMessage } from './ErrorMessage';

export default function CompanyDetails() {
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [customBenefit, setCustomBenefit] = useState<string>('');
  const [socials, setSocials] = useState<{ platform_name: string, url: string }[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [website, setWebsite] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [companyData, setCompanyData] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const { userData } = useUser();
  const router = useRouter();

  const old_benefits = companyData?.benefits || []  ;
  const new_benefits = selectedBenefits;
  const is_changed = companyData?.name !== companyData?.name || description !== companyData?.description || new_benefits.sort().join(',') !== old_benefits.sort().join(',') || address !== companyData?.billing_address;
  const old_socials = companyData?.social_media || [];
  const new_socials = socials;
  // eslint-disable-next-line max-len
  const is_socials_changed = JSON.stringify(new_socials.sort((a, b) => a.url.localeCompare(b.url))) !== JSON.stringify(old_socials.sort((a, b) => a.url.localeCompare(b.url)));

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

      setCompanyData(company);
      setSelectedBenefits(company.benefits || []);
      setDescription(company.description || '');
      setName(company.name || '');
      setSocials(company.social_media || []);
      setWebsite(company.website || '');
      setAddress(company.billing_address || '');
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
      return;
    }

    setIsLoading(true);

    fetchCompany();
  }, [router, userData, fetchCompany]);

  const handleInfoChange = async () => {
    setError('');
    setIsLoading(true);
    if (!is_changed) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/updateCompanyInfo', {
        method: 'POST',
        body: JSON.stringify({ company_id: companyData?.id, name: companyData?.name === name ? "" : name, description: companyData?.description === description ? "" : description, selectedBenefits: companyData?.benefits === selectedBenefits ? [] : selectedBenefits, address: companyData?.billing_address === address ? "" : address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message);
      }

      fetchCompany();
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSocialsChange = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/updateCompanySocials', {
        method: 'POST',
        body: JSON.stringify({ company_id: companyData?.id, socials: socials }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message);
      }

      fetchCompany();
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setLogoFile(selectedFile);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('company_id', companyData?.id?.toString() || '');
      setIsLoading(true);

      try {
        const response = await fetch('/api/uploadCompanyLogo', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message);
        }

        setLogoFile(null);
        fetchCompany();
      } catch (error: any) {
        // Clear the file input
        e.target.value = '';
        setLogoFile(null);
        setError(error.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setBannerFile(selectedFile);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('company_id', companyData?.id?.toString() || '');

      setIsLoading(true);

      try {
        const response = await fetch('/api/updateCompanyBanner', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message);
        }

        setBannerFile(null);
        fetchCompany();
      } catch (error: any) {
        // Clear the file input
        e.target.value = '';
        setBannerFile(null);
        setError(error.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (userData?.employer_profile?.role?.name !== 'admin') {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company Details</h1>

      <div className="relative">
        <div className="h-32 bg-gray-200 rounded-lg overflow-hidden group">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <label htmlFor="banner-upload" className="cursor-pointer group relative block h-full">
              <Image
                src={bannerFile ? URL.createObjectURL(bannerFile) : companyData?.banner?.url || '/images/emptyLogo.png'}
                alt="Company banner"
                className="w-full h-full object-cover transition-all duration-200 group-hover:blur-sm"
                width={1920}
                height={1080}
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <input
                type="file"
                id="banner-upload"
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={handleBannerChange}
              />
            </label>
          )}
        </div>
        <div className="absolute -bottom-16 left-4">
          {isLoading ? (
            <Skeleton className="w-32 h-32" />
          ) : (
            <label htmlFor="logo-upload" className="cursor-pointer group relative block w-full h-full">
              <Avatar className="w-32 h-32 border-4 border-white overflow-hidden">
                <AvatarImage
                  src={logoFile ? URL.createObjectURL(logoFile) : companyData?.logo?.url || '/images/emptyLogo.png'}
                  alt="Company logo"
                  className="object-cover w-full h-full transition-all duration-200 group-hover:blur-sm"
                />
                <AvatarFallback>CO</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={handleLogoChange}
              />
            </label>
          )}
        </div>
      </div>

      <div className="h-16" />
      {error && <ErrorMessage error={error} setError={setError} />}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            {isLoading ? <Skeleton className="w-full h-8" /> : (
              <Input
                id="company-name"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
          </div>
          <div>
            <Label htmlFor="company-address">Company Address</Label>
            {isLoading ? <Skeleton className="w-full h-8" /> : (
              <Input
                id="company-address"
                defaultValue={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            )}
          </div>
          <div>
            <Label>Benefits</Label>
            <div className="space-y-2 mt-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom benefit"
                  value={customBenefit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedBenefits([...selectedBenefits, e.currentTarget.value]);
                      e.currentTarget.value = '';
                      setCustomBenefit('');

                      if (selectedBenefits.includes(customBenefit)) {
                        setCustomBenefit('');
                      }
                    }
                  }}
                  onChange={(e) => {
                    setCustomBenefit(e.currentTarget.value);
                  }}
                />
                <Button
                  disabled={!customBenefit}
                  onClick={() => {
                    if (customBenefit) {
                      setSelectedBenefits([...selectedBenefits, customBenefit]);
                      setCustomBenefit('');

                      if (selectedBenefits.includes(customBenefit)) {
                        setCustomBenefit('');
                      }
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedBenefits.map((benefit) => (
                <Badge
                  key={benefit}
                  variant="secondary"
                  className="text-sm py-1 px-2"
                >
                  {benefit}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0"
                    onClick={() => setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="company-summary">Company Summary</Label>
            {isLoading ? <Skeleton className="w-full h-8" /> : (
              <textarea
                id="company-summary"
                className="w-full mt-1 p-2 border rounded-md"
                rows={4}
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button 
            type="submit" 
            className="w-full"
            size="lg"
            disabled={isLoading || !is_changed}
            onClick={handleInfoChange}
          >
            Save Changes
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Employer Branding</h2>
        <div className="space-y-4">
          <div>
            <Label>Social Media Links</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-gray-500 mr-2" />
                {isLoading ? (
                  <div className="flex-grow">
                    <Skeleton className="w-full h-8" />
                  </div>
                ) : (
                  <Input
                    placeholder="LinkedIn"
                    className="flex-grow"
                    defaultValue={socials.find((s) => s.platform_name === 'linkedin')?.url}
                    onChange={(e) => {
                      const existingSocials = socials.filter((s) => s.platform_name !== 'linkedin');
                      if (e.target.value) {
                        setSocials([...existingSocials, { platform_name: 'linkedin', url: e.target.value }]);
                      } else {
                        setSocials(existingSocials);
                      }
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Twitter className="h-5 w-5 text-gray-500 mr-2" />
                {isLoading ? (
                  <div className="flex-grow">
                    <Skeleton className="w-full h-8" />
                  </div>
                ) : (
                  <Input
                    placeholder="Twitter"
                    className="flex-grow"
                    defaultValue={socials.find((s) => s.platform_name === 'twitter' || s.platform_name === 'x')?.url}
                    onChange={(e) => {
                      const existingSocials = socials.filter((s) => s.platform_name !== 'twitter' && s.platform_name !== 'x');
                      if (e.target.value) {
                        setSocials([...existingSocials, { platform_name: 'x', url: e.target.value }]);
                      } else {
                        setSocials(existingSocials);
                      }
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-500 mr-2" />
                {isLoading ? (
                  <div className="flex-grow">
                    <Skeleton className="w-full h-8" />
                  </div>
                ) : (
                  <Input
                    value={website}
                    readOnly
                    className="flex-grow"
                  />
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <Info size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New email needs to be confirmed to change website</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button 
            type="submit" 
            className="w-full"
            size="lg"
            disabled={isLoading || !is_socials_changed}
            onClick={handleSocialsChange}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
