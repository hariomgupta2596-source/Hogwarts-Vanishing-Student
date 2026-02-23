import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useGameStore } from "@/lib/store";
import type { CreateUserRequest, UpdateProgressRequest, FinalChoiceRequest, UserResponse, LeaderboardResponse } from "@shared/routes";

export function useLogin() {
  const setUser = useGameStore(state => state.setUser);
  
  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const res = await fetch(api.users.createOrGet.path, {
        method: api.users.createOrGet.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to login");
      }
      return res.json() as Promise<UserResponse>;
    },
    onSuccess: (user) => {
      setUser(user);
    }
  });
}

export function useUpdateProgress() {
  const { user, setUser } = useGameStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateProgressRequest) => {
      if (!user) throw new Error("Not logged in");
      const url = buildUrl(api.users.updateProgress.path, { id: user.id });
      
      const res = await fetch(url, {
        method: api.users.updateProgress.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to update progress");
      return res.json() as Promise<UserResponse>;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: [api.leaderboard.get.path] });
    }
  });
}

export function useFinalChoice() {
  const { user, setUser } = useGameStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FinalChoiceRequest) => {
      if (!user) throw new Error("Not logged in");
      const url = buildUrl(api.users.makeFinalChoice.path, { id: user.id });
      
      const res = await fetch(url, {
        method: api.users.makeFinalChoice.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to submit final choice");
      return res.json() as Promise<UserResponse>;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: [api.leaderboard.get.path] });
    }
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: [api.leaderboard.get.path],
    queryFn: async () => {
      const res = await fetch(api.leaderboard.get.path);
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json() as Promise<LeaderboardResponse>;
    }
  });
}
