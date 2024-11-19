export interface BillingDetails {
  id: number;
  company_id: string;
  billing_email: string;
  billing_address: string;
  tax_id: string;
  payment_method: 'creditCard' | 'bankTransfer' | 'payPal';
  contact_person: string;
}
