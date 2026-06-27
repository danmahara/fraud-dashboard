export default function Placeholder({ title, description }) {
    return (
        <div>
            <h1 className="mb-1 text-2xl font-bold">{title}</h1>
            <p className="mb-6 text-sm text-text-muted">{description}</p>
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border bg-surface text-text-muted">
                Coming soon
            </div>
        </div>
    );
}