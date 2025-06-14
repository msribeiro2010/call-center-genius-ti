
import { supabase } from '@/integrations/supabase/client';
import type { AdminMessage } from '@/types/admin';

export const adminMessageService = {
  async fetchMessages(userId?: string): Promise<AdminMessage[]> {
    let query = supabase
      .from('admin_messages')
      .select('id, from_user_id, to_user_id, message, read, created_at')
      .order('created_at', { ascending: true });

    if (userId) {
      query = query.or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`);
    }

    const { data: messages, error: messagesError } = await query;
    if (messagesError) throw messagesError;

    if (!messages || messages.length === 0) {
      return [];
    }

    // Get unique user IDs from messages
    const userIds = [...new Set(messages.map(msg => msg.from_user_id))];

    // Get profiles for these users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nome_completo, email')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // Combine messages with profiles
    return messages.map(message => ({
      ...message,
      from_profiles: profiles?.find(profile => profile.id === message.from_user_id) || undefined
    }));
  },

  async sendMessage(fromUserId: string, toUserId: string, message: string): Promise<void> {
    const { error } = await supabase
      .from('admin_messages')
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        message
      });

    if (error) throw error;
  }
};
