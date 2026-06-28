import { useQuery } from "@tanstack/react-query";
import { getAdminUsers, getAdminUserDetail } from "../api/endpoints";

export function useAdminUsers() {
    return useQuery({ queryKey: ["adminUsers"], queryFn: getAdminUsers });
}

export function useAdminUserDetail(id) {
    return useQuery({
        queryKey: ["adminUser", id],
        queryFn: () => getAdminUserDetail(id),
        enabled: !!id,   // only fetch when a user is selected
    });
}