import { getISTTimestamp } from "./timeStamp.js";

const isProductoion = process.env.NODE_ENV === "production";

export const logger = {
    info(message) {
        if (isProductoion) return;
        console.log(`[INFO] ${getISTTimestamp()} ${message}`);
    },
    success(message) {
        if (isProductoion) return;
        console.log(`[SUCCESS] ${getISTTimestamp()} ${message}`);
    },
    error(message) {
        console.log(`[ERROR] ${getISTTimestamp()} ${message}`);
    },
    service(name, message) {
        console.log(`[${name}] ${getISTTimestamp()} ${message}`);
    },
};