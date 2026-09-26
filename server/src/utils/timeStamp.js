/** Returns the current time formatted as IST, e.g. "14/08/2026, 17:45:12". */

const IST_TIME_ZONE = "Asia/Kolkata";
export function getISTTimestamp() {
    return new Date().toLocaleString("en-IN", {
        timeZone: IST_TIME_ZONE,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}