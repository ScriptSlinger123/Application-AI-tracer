import { supabase } from '../Config/SupabaseConfig.js';
import { dbConfig } from '../Config/DatabaseConfig.js';

const table = dbConfig.tables.aiSuggestions;

export class AISuggestionRepository {
  async create({ application_id, cover_letter_text, ai_score }) {
    const { data, error } = await supabase
      .from(table)
      .insert({ application_id, cover_letter_text, ai_score })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  async findByApplication(applicationId) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
}
