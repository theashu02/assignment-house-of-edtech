import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  name: string;
}

export function useUser() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
  });

  const updateUser = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        throw new Error("Failed to update user");
      }
      return res.json();
    },
    onSuccess: (newUser) => {
      // Update the user data in the cache
      queryClient.setQueryData(["user"], newUser);
    },
  });

  return {
    user,
    isLoading,
    updateUser: updateUser.mutate,
    isUpdating: updateUser.isPending,
  };
}
