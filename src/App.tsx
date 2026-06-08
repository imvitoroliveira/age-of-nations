import { Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Workouts from "@/pages/Workouts";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Achievements from "@/pages/Achievements";
import Layout from "@/components/layout/Layout";
import WorkoutExecution from "@/pages/WorkoutExecution";
import CreateWorkout from "@/pages/CreateWorkout";
import AdminExercises from "@/pages/AdminExercises";


function App() {
  const { session, loading } = useSession();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" />} />
      
      <Route element={session ? <Layout /> : <Navigate to="/auth" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workouts/create" element={<CreateWorkout />} />
        <Route path="/admin/exercises" element={<AdminExercises />} />
        <Route path="/progress" element={<Progress />} />

        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route 
        path="/workout-execution/:id" 
        element={session ? <WorkoutExecution /> : <Navigate to="/auth" />} 
      />
    </Routes>
  );
}

export default App;
