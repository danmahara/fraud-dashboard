import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
    // Close on Escape key.
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        // Backdrop — clicking it closes the modal.
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            {/* Stop propagation so clicks inside the card don't close it. */}
            <div
                className="w-full max-w-lg rounded-xl bg-surface shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-text-muted hover:bg-bg"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
            </div>
        </div>
    );
}