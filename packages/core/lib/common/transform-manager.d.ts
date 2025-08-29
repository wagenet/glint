import { TransformedModule, Diagnostic } from '../transform/index.js';
import type * as ts from 'typescript';
import { GlintConfig } from '../config/index.js';
import DocumentCache from './document-cache.js';
declare type MappingTree = NonNullable<ReturnType<TransformedModule['getOriginalRange']>['mapping']>;
declare type TransformInfo = {
    version: string;
    transformedFileName: string;
    transformedModule: TransformedModule | null;
};
export default class TransformManager {
    private glintConfig;
    private documents;
    private transformCache;
    private moduleResolutionHost;
    private readonly ts;
    readonly moduleResolutionCache: ts.ModuleResolutionCache;
    constructor(glintConfig: GlintConfig, documents?: DocumentCache);
    getTransformDiagnostics(fileName?: string): Array<Diagnostic>;
    rewriteDiagnostics(diagnostics: ReadonlyArray<Diagnostic>, fileName?: string): ReadonlyArray<ts.Diagnostic>;
    getTransformedRange(originalFileName: string, originalStart: number, originalEnd: number): {
        transformedFileName: string;
        transformedStart: number;
        transformedEnd: number;
        mapping?: MappingTree | undefined;
    };
    getOriginalRange(transformedFileName: string, transformedStart: number, transformedEnd: number): {
        originalFileName: string;
        originalStart: number;
        originalEnd: number;
        mapping?: MappingTree;
    };
    getTransformedOffset(originalFileName: string, originalOffset: number): {
        transformedFileName: string;
        transformedOffset: number;
    };
    resolveModuleNameLiterals: (moduleLiterals: readonly ts.StringLiteralLike[], containingFile: string, redirectedReference: ts.ResolvedProjectReference | undefined, options: ts.CompilerOptions) => readonly ts.ResolvedModuleWithFailedLookupLocations[];
    watchTransformedFile: (path: string, originalCallback: ts.FileWatcherCallback, pollingInterval?: number, options?: ts.WatchOptions) => ts.FileWatcher;
    watchDirectory: (path: string, originalCallback: ts.DirectoryWatcherCallback, recursive?: boolean, options?: ts.WatchOptions) => ts.FileWatcher;
    readDirectory: (rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string>, depth?: number | undefined) => Array<string>;
    fileExists: (filename: string) => boolean;
    readTransformedFile: (filename: string, encoding?: string) => string | undefined;
    getModifiedTime: (filename: string) => Date | undefined;
    /**
     * Given the path of a file on disk, returns the path under which we present TypeScript with
     * its contents. This will include normalizations like `.gts` -> `.ts`, as well as relating
     * a given `.hbs` file back to its backing module, if one exists.
     */
    getScriptPathForTS(filename: string): string;
    /** @internal `TransformInfo` is an unstable internal type */
    findTransformInfoForOriginalFile(originalFileName: string): TransformInfo | null;
    private getExpectErrorDirectives;
    private rewriteDiagnostic;
    private getTransformInfo;
    private buildTransformDiagnostics;
    private findAlternativeDeclarationFile;
}
export {};
