
import { supabase } from '@/integrations/supabase/client';

export const adminService = {
  async checkAdminStatus(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.is_admin || false;
  }
};
