import { supabase } from '../Config/SupabaseConfig.js';
import { dbConfig } from '../Config/DatabaseConfig.js';

const table = dbConfig.tables.users;

export class UserRepository {
  async findByEmail(email) {
    const { data, error } = await supabase.from(table).select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase.from(table).select('id, name, email, created_at').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async create({ name, email, password_hash }) {
    const { data, error } = await supabase
      .from(table)
      .insert({ name, email, password_hash })
      .select('id, name, email, created_at')
      .single();
    if (error) throw error;
    return data;
  }
}
