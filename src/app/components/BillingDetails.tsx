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
import { Checkbox } from '@/components/ui/checkbox';

export default function BillingDetails() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing Details</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <Checkbox id="same-address" />
            <label htmlFor="same-address" className="ml-2">
              Billing address is the same as company address
            </label>
          </div>
          <div>
            <Label htmlFor="billing-name">Full Name</Label>
            <Input id="billing-name" />
          </div>
          <div>
            <Label htmlFor="billing-country">Country</Label>
            <Select>
              <SelectTrigger id="billing-country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
          </div>
          {/* Add more form fields as needed */}
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
                />
                <label htmlFor="credit-card">Credit Card</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="payment-method"
                  className="mr-2"
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="bank-transfer"
                  name="payment-method"
                  className="mr-2"
                />
                <label htmlFor="bank-transfer">Bank Transfer</label>
              </div>
            </div>
          </div>
          {/* Add specific payment method forms here */}
        </div>
      </Card>
    </div>
  );
}