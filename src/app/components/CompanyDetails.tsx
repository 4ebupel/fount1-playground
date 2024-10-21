import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  Upload,
  Linkedin,
  Twitter,
  Globe,
  Info,
  X,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
// import Image from 'next/image';

export default function CompanyDetails() {
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [customBenefit, setCustomBenefit] = useState('');

  const benefitOptions = [
    'Equity/Stock Options',
    'Flexible Work Hours',
    // ... more benefits
  ];

  const handleBenefitSelect = (benefit: string) => {
    if (!selectedBenefits.includes(benefit)) {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  const handleRemoveBenefit = (benefit: string) => {
    setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
  };

  const handleCustomBenefitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBenefit && !selectedBenefits.includes(customBenefit)) {
      setSelectedBenefits([...selectedBenefits, customBenefit]);
      setCustomBenefit('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company Details</h1>

      <div className="relative">
        <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
          {/* <Image
            src="/images/emptyLogo.png"
            alt="Company banner"
            className="w-full h-full object-cover"
            width={100}
            height={100}
          /> */}
          <img src="/images/emptyLogo.png" alt="Company banner" className="w-full h-full object-cover" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            {' '}
            Change Banner
          </Button>
        </div>
        <div className="absolute -bottom-16 left-4">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage src="/images/emptyLogo.png" alt="Company logo" />
              <AvatarFallback>CO</AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="h-16" />

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Select>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                {/* Add more industries as needed */}
              </SelectContent>
            </Select>
          </div>
          {/* Add more form fields as needed */}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Employer Branding</h2>
        <div className="space-y-4">
          <div>
            <Label>Social Media Links</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center">
                <Linkedin className="h-5 w-5 text-gray-500 mr-2" />
                <Input placeholder="LinkedIn" className="flex-grow" />
              </div>
              <div className="flex items-center">
                <Twitter className="h-5 w-5 text-gray-500 mr-2" />
                <Input placeholder="Twitter" className="flex-grow" />
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-500 mr-2" />
                <Input
                  value="https://example.com"
                  readOnly
                  className="flex-grow"
                />
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
          <div>
            <Label htmlFor="company-summary">Company Summary</Label>
            <textarea
              id="company-summary"
              className="w-full mt-1 p-2 border rounded-md"
              rows={4}
            />
          </div>
          <div>
            <Label>Benefits</Label>
            <div className="space-y-2 mt-2">
              <Select onValueChange={handleBenefitSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select benefits" />
                </SelectTrigger>
                <SelectContent>
                  {benefitOptions.filter((benefit) => !selectedBenefits.includes(benefit)).map((benefit) => (
                    <SelectItem key={benefit} value={benefit}>
                      {benefit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                      onClick={() => handleRemoveBenefit(benefit)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <form onSubmit={handleCustomBenefitAdd} className="flex gap-2">
                <Input
                  placeholder="Add custom benefit"
                  value={customBenefit}
                  onChange={(e) => setCustomBenefit(e.target.value)}
                />
                <Button type="submit">Add</Button>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
