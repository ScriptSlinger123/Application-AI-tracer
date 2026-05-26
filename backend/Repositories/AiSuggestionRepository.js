import { supabase } from '../Config/SupabaseConfig.js';
import { AppError } from '../Utils/AppError.js';

export class AiSuggestionRepository {
  async create({ applicationId, coverLetterText, aiScore }) {
    const { data, error } = await supabase
      .from('ai_suggestions')
      .insert({
        application_id: applicationId,
        cover_letter_text: coverLetterText,
        ai_score: aiScore ?? null,
      })
      .select('*')
      .single();
    if (error) throw new AppError(error.message, 500);
    return data;
  }
}
