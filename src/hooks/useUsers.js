import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  getAdminUserDetail,
  updateAdminAccount,
} from "../api/endpoints";

export function useAdminUsers() {
  return useQuery({ queryKey: ["adminUsers"], queryFn: getAdminUsers });
}

export function useAdminUserDetail(id) {
  return useQuery({
    queryKey: ["adminUser", id],
    queryFn: () => getAdminUserDetail(id),
    enabled: !!id, // only fetch when a user is selected
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => updateAdminAccount(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminUser"] });
      qc.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}
