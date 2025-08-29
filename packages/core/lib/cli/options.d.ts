import { type CompilerOptions } from 'typescript';
export declare function determineOptionsToExtend(argv: {
    declaration?: boolean | undefined;
    incremental?: boolean | undefined;
    preserveWatchOutput?: boolean | undefined;
}): CompilerOptions;
