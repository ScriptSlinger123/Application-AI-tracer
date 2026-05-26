import { supabase } from '../Config/SupabaseConfig.js';
import { dbConfig } from '../Config/DatabaseConfig.js';

const table = dbConfig.tables.jobs;

export class JobRepository {
  async findAll() {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(job) {
    const { data, error } = await supabase.from(table).insert(job).select('*').single();
    if (error) throw error;
    return data;
  }
}
