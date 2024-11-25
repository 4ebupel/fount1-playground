export interface BaseUser {
  id: number;
  created_at: number;
  name_first: string;
  name_last: string;
  email: string;
  account_status: string;
  date_last_verified: Date;
  is_verified: boolean;
}
