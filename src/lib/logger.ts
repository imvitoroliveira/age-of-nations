type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * Factory Pattern for Logger creation.
 * Provides consistent telemetry format across the application.
 */
export const createLogger = (namespace: string) => {
  const log = (level: LogLevel, message: string, data?: unknown) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${namespace}] ${message}`;
    
    // In production, this would send to an observability platform (Sentry/Datadog)
    if (level === "error") {
      console.error(formattedMessage, data || "");
    } else if (import.meta.env.DEV) {
      console[level](formattedMessage, data || "");
    }
  };

  return {
    info: (msg: string, data?: unknown) => log("info", msg, data),
    warn: (msg: string, data?: unknown) => log("warn", msg, data),
    error: (msg: string, data?: unknown) => log("error", msg, data),
    debug: (msg: string, data?: unknown) => log("debug", msg, data),
  };
};
