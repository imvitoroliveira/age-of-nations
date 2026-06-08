import { supabase } from "@/lib/supabase";

export async function checkSystemHealth() {
  const results = {
    database: false,
    auth: false,
    connectivity: false,
    tables: {
      profiles: false,
      workout_plans: false,
      workout_sessions: false,
      achievements: false
    } as Record<string, boolean>
  };

  try {
    await supabase.auth.getSession();
    results.connectivity = true;
    results.auth = true;

    // Check tables one by one to avoid TS issues with record keys if strict
    const { error: pError } = await supabase.from('profiles').select('id').limit(1);
    results.tables.profiles = !pError;
    
    const { error: wError } = await supabase.from('workout_plans').select('id').limit(1);
    results.tables.workout_plans = !wError;

    const { error: sError } = await supabase.from('workout_sessions').select('id').limit(1);
    results.tables.workout_sessions = !sError;

    const { error: aError } = await supabase.from('achievements').select('id').limit(1);
    results.tables.achievements = !aError;

    results.database = results.tables.profiles || results.tables.workout_plans;
    
    console.log("System Health Report:", results);
    return results;
  } catch (err) {
    console.error("Health Check failed:", err);
    return results;
  }
}
