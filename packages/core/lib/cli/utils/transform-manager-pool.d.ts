import * as TS from 'typescript';
import TransformManager from '../../common/transform-manager.js';
/**
 * A lazy cache/lookup map for the parts of `TS.System` which `TransformManager`
 * cares about, such that any given file will be resolved against its closest
 * `GlintConfig`. This provides us three things:
 *
 * - The ability to apply the *correct* transforms to any given file, based on
 *   its closest Glint config.
 * - Lazy instantation for each manager: we only get a `TransformManager` when
 *   we actually *require* it for transforming some file
 * - A cache for the managers: we only instantiate them *once* for a given
 *   config.
 */
export default class TransformManagerPool {
    #private;
    get isPool(): true;
    constructor(ts: typeof TS);
    managerForFile(path: string): TransformManager | null;
    managerForDirectory(path: string): TransformManager | null;
    resolveModuleNameLiterals: (moduleLiterals: readonly TS.StringLiteralLike[], containingFile: string, redirectedReference: TS.ResolvedProjectReference | undefined, options: TS.CompilerOptions) => readonly TS.ResolvedModuleWithFailedLookupLocations[];
    readDirectory: (rootDir: string, extensions: ReadonlyArray<string>, excludes: ReadonlyArray<string> | undefined, includes: ReadonlyArray<string>, depth?: number | undefined) => Array<string>;
    watchDirectory: (path: string, originalCallback: TS.DirectoryWatcherCallback, recursive?: boolean, options?: TS.WatchOptions) => TS.FileWatcher;
    fileExists: (filename: string) => boolean;
    watchTransformedFile: (path: string, originalCallback: TS.FileWatcherCallback, pollingInterval?: number, options?: TS.WatchOptions) => TS.FileWatcher;
    readTransformedFile: (filename: string, encoding?: string) => string | undefined;
    getModifiedTime: (filename: string) => Date | undefined;
}
