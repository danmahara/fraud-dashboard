import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyAccounts, getMerchants, createTransaction, getMyStats, getMyTransactions } from "../api/endpoints";

export function useMyAccounts() {
    return useQuery({ queryKey: ["myAccounts"], queryFn: getMyAccounts });
}

export function useMerchants() {
    return useQuery({ queryKey: ["merchants"], queryFn: getMerchants });
}


export function useCreateTransaction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => createTransaction(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["myStats"] });
            qc.invalidateQueries({ queryKey: ["myTransactions"] });
        },
    });
}



export function useMyStats() {
    return useQuery({ queryKey: ["myStats"], queryFn: getMyStats });
}

export function useMyTransactions(limit = 10) {
    return useQuery({
        queryKey: ["myTransactions", limit],
        queryFn: () => getMyTransactions(limit),
    });
}

import { keepPreviousData } from "@tanstack/react-query";
import { getMyTransactionsPage } from "../api/endpoints";

export function useMyTransactionsPage(page, size = 10) {
    return useQuery({
        queryKey: ["myTransactionsPage", page, size],
        queryFn: () => getMyTransactionsPage(page, size),
        placeholderData: keepPreviousData,  // keeps old page visible while next loads
    });
}