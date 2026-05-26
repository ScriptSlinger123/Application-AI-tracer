import { supabase } from '../Config/SupabaseConfig.js';
import { dbConfig } from '../Config/DatabaseConfig.js';

const table = dbConfig.tables.applications;

export class ApplicationRepository {
  async findByUser(userId) {
    const { data, error } = await supabase
      .from(table)
      .select('*, jobs(id, title, company, location)')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await supabase
      .from(table)
      .select('*, jobs(id, title, company, location, description)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findByIdForUser(id, userId) {
    const { data, error } = await supabase
      .from(table)
      .select('*, jobs(id, title, company, location, description)')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(application) {
    const { data, error } = await supabase.from(table).insert(application).select('*, jobs(id, title, company)').single();
    if (error) throw error;
    return data;
  }

  async update(id, userId, updates) {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*, jobs(id, title, company)')
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async statsByUser(userId) {
    const { data, error } = await supabase.from(table).select('status').eq('user_id', userId);
    if (error) throw error;
    const counts = { applied: 0, interview: 0, rejected: 0, offer: 0, total: 0 };
    for (const row of data || []) {
      if (counts[row.status] !== undefined) counts[row.status]++;
      counts.total++;
    }
    return counts;
  }
}
