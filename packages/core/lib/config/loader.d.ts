/// <reference types="node" resolution-mode="require"/>
import { GlintConfig } from './config.js';
import type * as TS from 'typescript';
/**
 * @private
 *
 * Only exported for testing purposes. Do not import.
 */
export declare const require: NodeRequire;
declare type TypeScript = typeof TS;
/**
 * `ConfigLoader` provides an interface for finding the Glint config that
 * applies to a given file or directory, ensuring that only a single instance
 * of `GlintConfig` is ever created for a given `tsconfig.json` or
 * `jsconfig.json` source file.
 */
export declare class ConfigLoader {
    private configs;
    configForFile(filePath: string): GlintConfig | null;
    configForDirectory(directory: string): GlintConfig | null;
}
export declare function findTypeScript(fromDir: string): TypeScript | null;
export {};
