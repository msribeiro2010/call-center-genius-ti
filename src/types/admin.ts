
export interface UserSession {
  id: string;
  user_id: string;
  last_seen: string;
  is_online: boolean;
  profiles?: {
    nome_completo: string;
    email: string;
    avatar_url?: string;
  };
}

export interface AdminMessage {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  read: boolean;
  created_at: string;
  from_profiles?: {
    nome_completo: string;
    email: string;
  };
}
