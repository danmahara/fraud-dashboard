import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";

// A stable per-browser id (the actual device identifier the signal compares).
export function getDeviceId() {
    let id = localStorage.getItem("device_id");
    if (!id) {
        id = uuidv4();
        localStorage.setItem("device_id", id);
    }
    return id;
}

// A human-readable label for THIS device, e.g. "Chrome on Windows".
// Used for display/notifications — not as the identifier.
export function getDeviceLabel() {
    const parser = new UAParser();
    const r = parser.getResult();
    const browser = r.browser.name || "Unknown browser";
    const os = r.os.name || "Unknown OS";
    return `${browser} on ${os}`;
}

// Both together, for sending to the backend.
export function getDeviceInfo() {
    return { deviceId: getDeviceId(), deviceLabel: getDeviceLabel() };
}