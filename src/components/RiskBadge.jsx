// Maps a risk level to its themed color (set in theme.css) and renders a pill.
const RISK_STYLES = {
    GREEN: "bg-risk-green",
    YELLOW: "bg-risk-yellow",
    ORANGE: "bg-risk-orange",
    RED: "bg-risk-red",
};

export default function RiskBadge({ level }) {
    const color = RISK_STYLES[level] || "bg-gray-400";
    return (
        <span
            className={`${color} inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white`}
        >
            {level || "—"}
        </span>
    );
}