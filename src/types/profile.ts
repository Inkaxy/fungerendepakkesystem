
export interface Profile {
  id: string;
  email?: string;
  name?: string;
  role: 'super_admin' | 'bakery_admin' | 'bakery_user';
  bakery_id?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileData {
  email: string;
  name: string;
  password: string;
  role: Profile['role'];
  bakery_id?: string;
}
