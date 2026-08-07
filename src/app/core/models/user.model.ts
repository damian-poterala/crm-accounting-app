export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  last_login_at: string | null;
}