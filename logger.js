import { createLogger, format as _format, transports as _transports } from "winston";

const devLogger = createLogger({
  level: "silly",
  format: _format.combine(
    _format.colorize(),
    _format.simple()
  ),
  transports: [new _transports.Console()],
});

const prodLogger = createLogger({
  level: "info",
  format: _format.json(),
  transports: [
    new _transports.File({ filename: "INFO.log" }),
    new _transports.File({ filename: "ERRORS.log", level: "error" }),
  ],
});


const logger = process.env.ENV === "production" ? prodLogger : devLogger;

logger.info(`Winston ENV: ${process.env.ENV}`);

export default logger;