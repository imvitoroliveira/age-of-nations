import { createLogger } from "./logger";

export interface AppError extends Error {
  code?: string;
  context?: Record<string, unknown>;
  severity?: "low" | "medium" | "high" | "critical";
}

const logger = createLogger("ErrorHandler");

/**
 * Centralized Error Handling Layer.
 * Prevents silent failures and prepares telemetry integration.
 */
export class ErrorHandler {
  static handle(error: unknown, context: string = "Global") {
    const appError = this.normalize(error);
    
    // Telemetry/Logging placeholder (impact: reduces Mean Time To Recovery - MTTR)
    logger.error(`[${context}] ${appError.message}`, {
      stack: appError.stack,
      ...appError.context,
    });

    // Strategy Pattern could be implemented here to handle different error types
    if (appError.severity === "critical") {
      // Logic for critical failure (e.g., redirect to maintenance or hard reset)
    }

    return appError;
  }

  private static normalize(error: unknown): AppError {
    if (error instanceof Error) return error as AppError;
    return new Error(typeof error === "string" ? error : "An unexpected error occurred") as AppError;
  }
}
