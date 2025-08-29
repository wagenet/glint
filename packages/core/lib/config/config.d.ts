import { GlintEnvironment } from './environment.js';
import { GlintConfigInput } from '@glint/core/config-types';
/**
 * This class represents parsed Glint configuration from a `tsconfig` or `jsconfig` file,
 * with methods for interrogating project configuration based on its contents.
 */
export declare class GlintConfig {
    readonly ts: typeof import('typescript');
    readonly rootDir: string;
    readonly configPath: string;
    readonly environment: GlintEnvironment;
    readonly checkStandaloneTemplates: boolean;
    private extensions;
    private parsedTsConfig?;
    constructor(ts: typeof import('typescript'), configPath: string, config: GlintConfigInput);
    /**
     * Indicates whether this configuration object applies to the file at the
     * given path.
     */
    includesFile(rawFileName: string): boolean;
    getSynthesizedScriptPathForTS(filename: string): string;
    /**
     * Parses and returns the TypeScript configuration for this project.
     * Results are cached after the first call.
     */
    getParsedTsConfig(): import('typescript').ParsedCommandLine;
    /**
     * Returns the TypeScript compiler options for this project.
     */
    getCompilerOptions(): import('typescript').CompilerOptions;
}
export declare function normalizePath(fileName: string): string;
