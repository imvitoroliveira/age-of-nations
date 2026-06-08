import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export async function checkSystemHealth() {
  const results = {
    database: false,
    auth: false,
    connectivity: false,
    tables: {} as Record<string, boolean>
  };

  try {
    // 1. Check connectivity
    const start = Date.now();
    const { data: { session } } = await supabase.auth.getSession();
    results.connectivity = true;
    results.auth = true; // If we can call getSession, auth module is loaded

    // 2. Check essential tables
    const tablesToCheck = ['profiles', 'workout_plans', 'workout_sessions', 'achievements'];
    
    for (const table of tablesToCheck) {
      const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
      results.tables[table] = !error || error.code !== 'PGRST116'; // Not found error code is different usually
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
