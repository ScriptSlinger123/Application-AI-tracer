import { supabase } from '../Config/SupabaseConfig.js';
import { AppError } from '../Utils/AppError.js';

export class UserRepository {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, created_at')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (error) throw new AppError(error.message, 500);
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new AppError(error.message, 500);
    return data;
  }

  async create({ name, email, passwordHash }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
      })
      .select('id, name, email, created_at')
      .single();
    if (error) {
      if (error.code === '23505') throw new AppError('Email already registered', 409);
      if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
        throw new AppError(
          'Database unreachable. Set valid SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env and run the SQL migration.',
          503
        );
      }
      throw new AppError(error.message, 500);
    }
    return data;
  }
}
