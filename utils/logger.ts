/**
 * Logger utility
 */

const DEBUG_LOGGING = false;

export const logger = {
    debug: (...args: unknown[]) => {
        if (__DEV__ && DEBUG_LOGGING) {
            console.log(...args);
        }
    },

    info: (...args: unknown[]) => {
        if (__DEV__) {
            console.info(...args);
        }
    },

    warn: (...args: unknown[]) => {
        console.warn(...args);
    },

    error: (...args: unknown[]) => {
        console.error(...args);
    },
};