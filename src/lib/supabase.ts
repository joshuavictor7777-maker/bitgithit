import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameStats {
  id?: string;
  user_id: string;
  games_played: number;
  hands_played: number;
  hands_won: number;
  hands_lost: number;
  hands_pushed: number;
  natural_21s: number;
  busts: number;
  strategy_correct: number;
  strategy_total: number;
  counting_correct: number;
  counting_total: number;
  updated_at?: string;
}

export interface GameSession {
  id?: string;
  user_id: string;
  session_date: string;
  hands_played: number;
  result: 'win' | 'loss' | 'push';
  net_result: number;
  duration_minutes: number;
}

export interface LearningProgress {
  id?: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  score: number;
  xp_earned: number;
  completed_at?: string;
}

export interface QuizResult {
  id?: string;
  user_id: string;
  quiz_type: 'basic-strategy' | 'card-counting';
  question_count: number;
  correct_answers: number;
  score_percentage: number;
  completed_at?: string;
}

export const statsService = {
  async getStats(userId: string): Promise<GameStats | null> {
    const { data, error } = await supabase
      .from('game_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }

    return data;
  },

  async updateStats(userId: string, stats: Partial<GameStats>): Promise<void> {
    const { error } = await supabase
      .from('game_stats')
      .upsert({
        user_id: userId,
        ...stats,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating stats:', error);
    }
  },

  async addSession(session: GameSession): Promise<void> {
    const { error } = await supabase
      .from('game_sessions')
      .insert(session);

    if (error) {
      console.error('Error adding session:', error);
    }
  },

  async getRecentSessions(userId: string, limit: number = 10): Promise<GameSession[]> {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('session_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }

    return data || [];
  },

  async updateLearningProgress(progress: LearningProgress): Promise<void> {
    const { error } = await supabase
      .from('learning_progress')
      .upsert({
        ...progress,
        completed_at: progress.completed ? new Date().toISOString() : null
      });

    if (error) {
      console.error('Error updating learning progress:', error);
    }
  },

  async getLearningProgress(userId: string): Promise<LearningProgress[]> {
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching learning progress:', error);
      return [];
    }

    return data || [];
  },

  async addQuizResult(result: QuizResult): Promise<void> {
    const { error } = await supabase
      .from('quiz_results')
      .insert({
        ...result,
        completed_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error adding quiz result:', error);
    }
  },

  async getQuizResults(userId: string, quizType?: string): Promise<QuizResult[]> {
    let query = supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId);

    if (quizType) {
      query = query.eq('quiz_type', quizType);
    }

    const { data, error } = await query.order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }

    return data || [];
  }
};
