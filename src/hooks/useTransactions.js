import { useQuery } from "@tanstack/react-query";
import { getRecentTransactions } from "../api/endpoints";
import { keepPreviousData } from "@tanstack/react-query";
import { getAdminTransactionsPage } from "../api/endpoints";

// useQuery: for reading data. refetchInterval makes it poll automatically —
// React Query replaces the manual setInterval we had before.
export function useTransactions(limit = 50) {
    return useQuery({
        queryKey: ["transactions", limit],
        queryFn: () => getRecentTransactions(limit),
        refetchInterval: 4000,        // poll every 4s
        refetchOnWindowFocus: true,   // refresh when you tab back
    });
}


// for admin
export function useAdminTransactionsPage(page, size = 20) {
    return useQuery({
        queryKey: ["adminTransactionsPage", page, size],
        queryFn: () => getAdminTransactionsPage(page, size),
        placeholderData: keepPreviousData,
    });
}