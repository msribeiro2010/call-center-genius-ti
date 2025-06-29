export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_messages: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          message: string
          read: boolean | null
          to_user_id: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          message: string
          read?: boolean | null
          to_user_id: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          message?: string
          read?: boolean | null
          to_user_id?: string
        }
        Relationships: []
      }
      assuntos: {
        Row: {
          categoria: string | null
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      assuntos_base_conhecimento: {
        Row: {
          categoria: string | null
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      base_conhecimento: {
        Row: {
          arquivo_print: string | null
          categoria: string | null
          created_at: string
          id: string
          problema_descricao: string
          solucao: string
          tags: string[] | null
          titulo: string
          updated_at: string
          util_count: number | null
          visualizacoes: number | null
        }
        Insert: {
          arquivo_print?: string | null
          categoria?: string | null
          created_at?: string
          id?: string
          problema_descricao: string
          solucao: string
          tags?: string[] | null
          titulo: string
          updated_at?: string
          util_count?: number | null
          visualizacoes?: number | null
        }
        Update: {
          arquivo_print?: string | null
          categoria?: string | null
          created_at?: string
          id?: string
          problema_descricao?: string
          solucao?: string
          tags?: string[] | null
          titulo?: string
          updated_at?: string
          util_count?: number | null
          visualizacoes?: number | null
        }
        Relationships: []
      }
      chamados: {
        Row: {
          assunto_id: string | null
          chamado_origem: string | null
          cpf_usuario_afetado: string | null
          created_at: string
          created_by: string | null
          descricao: string
          grau: string | null
          id: string
          nome_usuario_afetado: string | null
          numero_processo: string | null
          oj_detectada: string | null
          orgao_julgador: string | null
          perfil_usuario_afetado: string | null
          prioridade: number | null
          status: string | null
          tipo: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          assunto_id?: string | null
          chamado_origem?: string | null
          cpf_usuario_afetado?: string | null
          created_at?: string
          created_by?: string | null
          descricao: string
          grau?: string | null
          id?: string
          nome_usuario_afetado?: string | null
          numero_processo?: string | null
          oj_detectada?: string | null
          orgao_julgador?: string | null
          perfil_usuario_afetado?: string | null
          prioridade?: number | null
          status?: string | null
          tipo?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          assunto_id?: string | null
          chamado_origem?: string | null
          cpf_usuario_afetado?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string
          grau?: string | null
          id?: string
          nome_usuario_afetado?: string | null
          numero_processo?: string | null
          oj_detectada?: string | null
          orgao_julgador?: string | null
          perfil_usuario_afetado?: string | null
          prioridade?: number | null
          status?: string | null
          tipo?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chamados_assunto_id_fkey"
            columns: ["assunto_id"]
            isOneToOne: false
            referencedRelation: "assuntos"
            referencedColumns: ["id"]
          },
        ]
      }
      processos: {
        Row: {
          created_at: string
          grau: string | null
          id: string
          numero_processo: string
          oj_detectada: string | null
          orgao_julgador: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          grau?: string | null
          id?: string
          numero_processo: string
          oj_detectada?: string | null
          orgao_julgador?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          grau?: string | null
          id?: string
          numero_processo?: string
          oj_detectada?: string | null
          orgao_julgador?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_admin: boolean | null
          nome_completo: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          is_admin?: boolean | null
          nome_completo?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean | null
          nome_completo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          id: string
          is_online: boolean | null
          last_seen: string
          user_id: string
        }
        Insert: {
          id?: string
          is_online?: boolean | null
          last_seen?: string
          user_id: string
        }
        Update: {
          id?: string
          is_online?: boolean | null
          last_seen?: string
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          cpf: string
          created_at: string
          id: string
          nome_completo: string
          perfil: string | null
          updated_at: string
        }
        Insert: {
          cpf: string
          created_at?: string
          id?: string
          nome_completo: string
          perfil?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: string
          created_at?: string
          id?: string
          nome_completo?: string
          perfil?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
