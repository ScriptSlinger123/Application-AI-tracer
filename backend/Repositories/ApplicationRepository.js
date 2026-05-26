import { supabase } from '../Config/SupabaseConfig.js';
import { AppError } from '../Utils/AppError.js';

export class ApplicationRepository {
  async findByUser(userId) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(id, title, company, location)')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });
    if (error) throw new AppError(error.message, 500);
    return data || [];
  }

  async findById(id, userId) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new AppError(error.message, 500);
    return data;
  }

  async create({ userId, jobId, status, cvVersion, notes }) {
    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        job_id: jobId,
        status: status || 'applied',
        cv_version: cvVersion,
        notes,
      })
      .select('*, jobs(id, title, company, location)')
      .single();
    if (error) {
      if (error.code === '23505') throw new AppError('Already applied to this job', 409);
      throw new AppError(error.message, 500);
    }
    return data;
  }

  async update(id, userId, updates) {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*, jobs(id, title, company, location)')
      .single();
    if (error) throw new AppError(error.message, 500);
    if (!data) throw new AppError('Application not found', 404);
    return data;
  }

  async statsByStatus(userId) {
    const { data, error } = await supabase
      .from('applications')
      .select('status')
      .eq('user_id', userId);
    if (error) throw new AppError(error.message, 500);
    const counts = { applied: 0, interview: 0, rejected: 0, offer: 0 };
    for (const row of data || []) {
      if (counts[row.status] !== undefined) counts[row.status]++;
    }
    return counts;
  }
}
