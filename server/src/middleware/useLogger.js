import { logger } from "../utils/looger.js";

function requestLogger(req, res, next) {
    const startAt = Date.now();

    logger.info(`${req.method} ${req.originalUrl}`);

    res.on("finish", () => {
        const durationTimeMs = Date.now() - startAt;

        const summary =
            `${req.method} ${req.originalUrl} ` +
            `${res.statusCode} ${durationTimeMs}ms`;

        if (res.statusCode >= 400) {
            logger.error(summary);
        } else {
            logger.success(summary);
        }
    });

    next();
}

export default requestLogger;