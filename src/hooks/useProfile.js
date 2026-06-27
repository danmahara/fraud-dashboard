import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile } from "../api/endpoints";

// Read the current user's profile (used for the completeness banner + onboarding).
export function useMyProfile() {
    return useQuery({
        queryKey: ["myProfile"],
        queryFn: getMyProfile,
    });
}

// Update the profile, then refresh the cached profile so the banner updates.
export function useUpdateProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => updateMyProfile(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["myProfile"] }),
    });
}