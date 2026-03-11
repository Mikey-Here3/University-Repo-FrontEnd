"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { getApiError } from "@/lib/utils";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    },
    onError: (error) => {
      const msg = getApiError(error);
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authService.register(name, email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
}

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 min — don't refetch often
    gcTime: 15 * 60 * 1000,
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch on tab switch
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: { name?: string; email?: string }) =>
      authService.updateProfile(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    },
    onError: (error) => toast.error(getApiError(error)),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(currentPassword, newPassword),
    onSuccess: () => toast.success("Password changed successfully"),
    onError: (error) => toast.error(getApiError(error)),
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    authService.logout().catch(() => {});
    logout();
    queryClient.clear();
    toast.success("Logged out");
    router.push("/");
  };
}