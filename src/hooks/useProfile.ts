import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, Profile } from "@/services/profile.service";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export function useProfile() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const user = await authService.getCurrentUser();
      if (!user) return null;
      return profileService.getProfile(user.id);
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error("Usuário não autenticado");
      return profileService.updateProfile(user.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar perfil");
    }
  });

  const linkPartnerMutation = useMutation({
    mutationFn: async (pairingCode: string) => {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error("Usuário não autenticado");
      return profileService.linkPartner(user.id, pairingCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success("Parceiro vinculado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao vincular parceiro");
    }
  });

  const unlinkPartnerMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error("Usuário não autenticado");
      return profileService.unlinkPartner(user.id, partnerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success("Vínculo removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao desvincular parceiro");
    }
  });

  return {
    ...profileQuery,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    linkPartner: linkPartnerMutation.mutate,
    isLinking: linkPartnerMutation.isPending,
    unlinkPartner: unlinkPartnerMutation.mutate,
    isUnlinking: unlinkPartnerMutation.isPending
  };
}

