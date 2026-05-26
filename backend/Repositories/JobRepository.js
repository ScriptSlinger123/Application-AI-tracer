import { supabase } from '../Config/SupabaseConfig.js';
import { AppError } from '../Utils/AppError.js';

export class JobRepository {
  async findAll({ search, limit = 50, offset = 0 } = {}) {
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw new AppError(error.message, 500);
    return { jobs: data || [], total: count ?? 0 };
  }

  async findById(id) {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
    if (error) throw new AppError(error.message, 500);
    return data;
  }

  async create(job) {
    const { data, error } = await supabase.from('jobs').insert(job).select('*').single();
    if (error) throw new AppError(error.message, 500);
    return data;
  }
}
