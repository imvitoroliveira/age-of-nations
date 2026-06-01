import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { authService } from "@/services/auth.service";

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      if (!user) return null;
      return profileService.getProfile(user.id);
    }
  });
}
