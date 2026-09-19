export type ID = string | number;

export interface Branch {
  id: ID;
  business_name?: string;
  fantasy_name?: string;
  name?: string;
  [key: string]: unknown;
}

export interface User {
  id: ID;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  is_client?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_organization_owner?: boolean;
  type_user?: string;
  [key: string]: unknown;
}

export interface LoginCompleteResponse {
  token: string;
  user: User;
  branches: Branch[];
  permissions?: {
    user_role?: string;
    enabled_apps?: string[];
    [key: string]: unknown;
  };
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Quotation {
  id: ID;
  order_number?: string | null;
  status?: string | null;
  total_amount?: string | number | null;
  observation?: string | null;
  created?: string | null;
  date?: string | null;
  client?: ID | { id: ID; name?: string; email?: string } | null;
  client_name?: string | null;
  [key: string]: unknown;
}
