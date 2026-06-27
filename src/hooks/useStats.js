import { useQuery } from "@tanstack/react-query";
import { getStats } from "../api/endpoints";

export function useStats() {
    return useQuery({
        queryKey: ["stats"],
        queryFn: getStats,
        refetchInterval: 5000, // keep the charts live as new transactions arrive
    });
}