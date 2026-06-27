import { useQuery } from "@tanstack/react-query";
import { getRecentTransactions } from "../api/endpoints";

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