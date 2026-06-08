import { supabase } from "@/lib/supabase";

export async function checkSystemHealth() {
  const results = {
    database: false,
    auth: false,
    connectivity: false,
    tables: {} as Record<string, boolean>
  };

  try {
    // 1. Check connectivity and auth
    await supabase.auth.getSession();
    results.connectivity = true;
    results.auth = true;

    // 2. Check essential tables
    const tablesToCheck = ['profiles', 'workout_plans', 'workout_sessions', 'achievements'];
    
    for (const table of tablesToCheck) {
      // Using query to check table accessibility
      const { error } = await supabase.from(table).select('id').limit(1);
      results.tables[table] = !error;
      if (error) console.warn(`Health Check: Table ${table} error:`, error);
    }

    results.database = Object.values(results.tables).some(v => v);
    
    console.log("System Health Report:", results);
    return results;
  } catch (err) {
    console.error("Health Check failed:", err);
    return results;
  }
}
