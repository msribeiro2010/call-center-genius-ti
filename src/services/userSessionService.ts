
import { supabase } from '@/integrations/supabase/client';
import type { UserSession } from '@/types/admin';

export const userSessionService = {
  async fetchUserSessions(): Promise<UserSession[]> {
    // First get user sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('user_sessions')
      .select('id, user_id, last_seen, is_online')
      .eq('is_online', true)
      .order('last_seen', { ascending: false });

    if (sessionsError) throw sessionsError;

    if (!sessions || sessions.length === 0) {
      return [];
    }

    // Get user IDs
    const userIds = sessions.map(session => session.user_id);

    // Get profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nome_completo, email, avatar_url')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // Combine sessions with profiles
    return sessions.map(session => ({
      ...session,
      profiles: profiles?.find(profile => profile.id === session.user_id) || undefined
    }));
  },

  async updateUserSession(userId: string): Promise<void> {
    await supabase
      .from('user_sessions')
      .upsert({
        user_id: userId,
        last_seen: new Date().toISOString(),
        is_online: true
      });
  }
};
