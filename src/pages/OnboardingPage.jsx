import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Loader2, Check, ShieldCheck } from "lucide-react";
import { useMyProfile, useUpdateProfile } from "../hooks/useProfile";
import { getDeviceId } from "../utils/device";

export default function OnboardingPage() {
    const navigate = useNavigate();
    const updateProfile = useUpdateProfile();
    const { data: profile } = useMyProfile();

    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const [locStatus, setLocStatus] = useState("idle");
    const [locError, setLocError] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        if (profile) {
            if (profile.homeLat != null) setLat(String(profile.homeLat));
            if (profile.homeLon != null) setLon(String(profile.homeLon));
            if (profile.dob) setDob(profile.dob);
            if (profile.gender) setGender(profile.gender);
        }
    }, [profile]);

    const isEditing = profile?.profileComplete;

    function detectLocation() {
        setLocStatus("loading");
        setLocError("");
        if (!navigator.geolocation) {
            setLocStatus("error");
            setLocError("Geolocation isn't supported by your browser. Enter coordinates manually.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(pos.coords.latitude.toFixed(4));
                setLon(pos.coords.longitude.toFixed(4));
                setLocStatus("done");
            },
            (err) => {
                setLocStatus("error");
                setLocError(
                    err.code === err.PERMISSION_DENIED
                        ? "Location permission denied. You can enter your coordinates manually below."
                        : "Couldn't detect your location. Enter it manually below."
                );
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function handleSubmit(e) {
        e.preventDefault();
        updateProfile.mutate(
            { homeLat: parseFloat(lat), homeLon: parseFloat(lon), dob, gender, deviceId: getDeviceId() },
            { onSuccess: () => navigate("/user") }
        );
    }

    const canSubmit = lat && lon && dob && gender && !updateProfile.isPending;
    const errorMessage =
        updateProfile.error?.response?.data?.message ||
        (updateProfile.isError ? "Couldn't save your profile. Please try again." : "");

    return (
        <div className="mx-auto max-w-xl px-6 py-12">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex rounded-xl border border-[#00C2FF]/25 bg-[#00C2FF]/10 p-3 text-[#00C2FF]">
                    <ShieldCheck size={24} />
                </div>
                <h1 className="text-2xl font-bold text-white">
                    {isEditing ? "Update your profile" : "Complete your profile"}
                </h1>
                <p className="mt-2 text-[14px] text-white/50">
                    {isEditing
                        ? "Adjust your home location or details. Changing your home location affects how distance is scored."
                        : "We use these details to protect your account. Your home location helps us spot payments made far from where you normally are."}
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-white/10 bg-[#141D2F] p-6"
            >
                {/* Location */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-white">Home location</label>
                    <button
                        type="button"
                        onClick={detectLocation}
                        disabled={locStatus === "loading"}
                        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-4 py-3 text-sm font-medium text-[#00C2FF] transition-all hover:bg-[#00C2FF]/15 disabled:opacity-60"
                    >
                        {locStatus === "loading" ? (
                            <><Loader2 size={16} className="animate-spin" /> Detecting…</>
                        ) : locStatus === "done" ? (
                            <><Check size={16} /> Location detected</>
                        ) : (
                            <><MapPin size={16} /> Use my current location</>
                        )}
                    </button>
                    {locError && (
                        <p className="mb-3 text-[13px] text-[#F59E0B]">{locError}</p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-white/40">Latitude</span>
                            <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="27.7172" className={inputClass} />
                        </div>
                        <div>
                            <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-white/40">Longitude</span>
                            <input value={lon} onChange={(e) => setLon(e.target.value)} placeholder="85.3240" className={inputClass} />
                        </div>
                    </div>
                    <p className="mt-2 font-mono text-[11px] text-white/30">
                        Detected automatically, or enter manually. You can adjust these.
                    </p>
                </div>

                {/* Date of birth */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-white">Date of birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputClass} />
                </div>

                {/* Gender */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-white">Gender</label>
                    <div className="grid grid-cols-2 gap-3">
                        <GenderOption value="M" label="Male" current={gender} onSelect={setGender} />
                        <GenderOption value="F" label="Female" current={gender} onSelect={setGender} />
                    </div>
                </div>

                {errorMessage && (
                    <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-2 text-sm text-[#EF4444]">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full rounded-xl bg-[#00C2FF] px-4 py-3 font-semibold text-[#0B1120] transition-all hover:bg-[#00D4FF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {updateProfile.isPending ? "Saving…" : isEditing ? "Save changes" : "Save and continue"}
                </button>
            </form>
        </div>
    );
}

function GenderOption({ value, label, current, onSelect }) {
    const active = current === value;
    return (
        <button
            type="button"
            onClick={() => onSelect(value)}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${active
                    ? "border-[#00C2FF] bg-[#00C2FF]/10 text-[#00C2FF]"
                    : "border-white/10 bg-[#0B1120] text-white/60 hover:border-white/20"
                }`}
        >
            {label}
        </button>
    );
}

const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#0B1120] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#00C2FF]/50 [color-scheme:dark]";