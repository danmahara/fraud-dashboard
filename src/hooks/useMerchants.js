import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAdminMerchants, getAdminCategories, createMerchant, updateMerchant,
} from "../api/merchantApi";

export function useAdminMerchants() {
    return useQuery({ queryKey: ["adminMerchants"], queryFn: getAdminMerchants });
}

export function useAdminCategories() {
    return useQuery({ queryKey: ["adminCategories"], queryFn: getAdminCategories });
}

export function useSaveMerchant() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) =>
            id ? updateMerchant(id, payload) : createMerchant(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["adminMerchants"] }),
    });
}