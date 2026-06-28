import { useState } from "react";
import { Plus, Pencil, MapPin } from "lucide-react";
import { useAdminMerchants, useAdminCategories, useSaveMerchant } from "../hooks/useMerchants";
import Modal from "../components/Modal";

const EMPTY = {
    name: "", email: "", phone: "", categoryId: "", lat: "", lon: "", active: true,
};

export default function AdminMerchantsPage() {
    const { data: merchants, isLoading } = useAdminMerchants();
    const [editing, setEditing] = useState(null); // null = closed; {} = new; {...} = edit

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text">Merchants</h1>
                    <p className="mt-1 text-sm text-text-muted">{merchants?.length ?? 0} merchants</p>
                </div>
                <button
                    onClick={() => setEditing({ ...EMPTY })}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                    <Plus size={16} /> Add merchant
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-4 py-10 text-center text-text-muted">Loading…</td></tr>
                        ) : merchants?.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-10 text-center text-text-muted">No merchants yet</td></tr>
                        ) : (
                            merchants?.map((m) => (
                                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-bg">
                                    <td className="px-4 py-3 font-medium text-text">{m.name}</td>
                                    <td className="px-4 py-3 text-text-muted">{m.categoryDisplayName}</td>
                                    <td className="px-4 py-3 text-text-muted">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {Number(m.lat).toFixed(4)}, {Number(m.lon).toFixed(4)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-text-muted">{m.phone || "—"}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            {m.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => setEditing({
                                                id: m.id, name: m.name, email: m.email ?? "", phone: m.phone ?? "",
                                                categoryId: m.categoryId, lat: m.lat, lon: m.lon, active: m.active,
                                            })}
                                            className="rounded-lg p-1.5 text-text-muted hover:bg-primary-light hover:text-primary"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                open={editing !== null}
                onClose={() => setEditing(null)}
                title={editing?.id ? "Edit merchant" : "Add merchant"}
            >
                {editing !== null && (
                    <MerchantForm initial={editing} onDone={() => setEditing(null)} />
                )}
            </Modal>
        </div>
    );
}

function MerchantForm({ initial, onDone }) {
    const { data: categories } = useAdminCategories();
    const save = useSaveMerchant();
    const [form, setForm] = useState(initial);

    function set(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            name: form.name,
            email: form.email || null,
            phone: form.phone || null,
            categoryId: Number(form.categoryId),
            lat: parseFloat(form.lat),
            lon: parseFloat(form.lon),
            active: form.active,
        };
        save.mutate(
            { id: form.id, payload },
            { onSuccess: onDone }
        );
    }

    const errorMessage =
        save.error?.response?.data?.message ||
        (save.isError ? "Couldn't save. Check the fields and try again." : "");

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name">
                <input value={form.name} onChange={(e) => set("name", e.target.value)} className={input} required />
            </Field>

            <Field label="Category">
                <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={input} required>
                    <option value="">Select a category…</option>
                    {categories?.map((c) => (
                        <option key={c.id} value={c.id}>{c.displayName}</option>
                    ))}
                </select>
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Latitude">
                    <input value={form.lat} onChange={(e) => set("lat", e.target.value)} className={input} placeholder="27.7172" required />
                </Field>
                <Field label="Longitude">
                    <input value={form.lon} onChange={(e) => set("lon", e.target.value)} className={input} placeholder="85.3240" required />
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Email (optional)">
                    <input value={form.email} onChange={(e) => set("email", e.target.value)} className={input} />
                </Field>
                <Field label="Phone (optional)">
                    <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={input} />
                </Field>
            </div>

            <label className="flex items-center gap-2 text-sm text-text">
                <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
                Active
            </label>

            {errorMessage && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</div>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onDone} className="rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:bg-bg">
                    Cancel
                </button>
                <button type="submit" disabled={save.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
                    {save.isPending ? "Saving…" : "Save"}
                </button>
            </div>
        </form>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-text">{label}</label>
            {children}
        </div>
    );
}

const input =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary";