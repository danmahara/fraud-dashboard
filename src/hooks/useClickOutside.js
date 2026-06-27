import { useEffect, useRef } from "react";

// Calls `handler` when a click/touch happens outside the returned ref element.
// Used to close dropdowns/menus when the user clicks elsewhere.
export function useClickOutside(handler) {
    const ref = useRef(null);

    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                handler();
            }
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [handler]);

    return ref;
}