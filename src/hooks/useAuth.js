import { useMutation } from "@tanstack/react-query";
import { login as loginRequest } from "../api/endpoints";

// useMutation: for actions that change state (login is a POST).
// Returns mutate(), plus isPending / isError for the UI.
export function useLogin() {
    return useMutation({
        mutationFn: ({ email, password }) => loginRequest(email, password),
    });
}