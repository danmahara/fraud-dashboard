import { useQuery, useMutation } from "@tanstack/react-query";
import { getMyAccounts, getMerchants, createTransaction } from "../api/endpoints";

export function useMyAccounts() {
    return useQuery({ queryKey: ["myAccounts"], queryFn: getMyAccounts });
}

export function useMerchants() {
    return useQuery({ queryKey: ["merchants"], queryFn: getMerchants });
}

export function useCreateTransaction() {
    return useMutation({ mutationFn: (payload) => createTransaction(payload) });
}