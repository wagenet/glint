import { TSLib } from '../transform/util.js';
export declare const MINIMUM_VERSION = "4.8.0";
export declare type ValidationResult = {
    valid: true;
    ts: TSLib;
} | {
    valid: false;
    reason: string;
};
/**
 * Ensures that the given copy of TypeScript is a) present, and
 * b) a supported version.
 */
export declare function validateTS(ts: TSLib | null): ValidationResult;
/**
 * Validates the given copy of TypeScript as with `validateTS`,
 * logging an error message and exiting the process if validation
 * fails.
 */
export declare function validateTSOrExit(ts: TSLib | null): asserts ts;
