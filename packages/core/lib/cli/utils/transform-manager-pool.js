var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TransformManagerPool_rootTS, _TransformManagerPool_rootSys, _TransformManagerPool_managers, _TransformManagerPool_loader;
import { dirname } from 'node:path';
import { ConfigLoader } from '../../config/index.js';
import TransformManager from '../../common/transform-manager.js';
import { assert } from './assert.js';
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
    constructor(ts) {
        _TransformManagerPool_rootTS.set(this, void 0);
        _TransformManagerPool_rootSys.set(this, void 0);
        _TransformManagerPool_managers.set(this, new Map());
        _TransformManagerPool_loader.set(this, new ConfigLoader());
        this.resolveModuleNameLiterals = (moduleLiterals, containingFile, redirectedReference, options) => {
            let resolveModuleNameLiterals = this.managerForFile(containingFile)?.resolveModuleNameLiterals;
            if (resolveModuleNameLiterals) {
                return resolveModuleNameLiterals(moduleLiterals, containingFile, redirectedReference, options);
            }
            else {
                return moduleLiterals.map((literal) => __classPrivateFieldGet(this, _TransformManagerPool_rootTS, "f").resolveModuleName(literal.text, containingFile, options, __classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f"), undefined, redirectedReference));
            }
        };
        this.readDirectory = (rootDir, extensions, excludes, includes, depth) => {
            let readDirectory = this.managerForDirectory(rootDir)?.readDirectory ?? __classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f").readDirectory;
            return readDirectory(rootDir, extensions, excludes, includes, depth);
        };
        this.watchDirectory = (path, originalCallback, recursive, options) => {
            assert(__classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f").watchDirectory);
            let watchDirectory = this.managerForDirectory(path)?.watchDirectory ?? __classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f").watchDirectory;
            return watchDirectory(path, originalCallback, recursive, options);
        };
        this.fileExists = (filename) => {
            let fileExists = this.managerForFile(filename)?.fileExists ?? __classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f").fileExists;
            return fileExists(filename);
        };
        this.watchTransformedFile = (path, originalCallback, pollingInterval, options) => {
            assert(__classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f").watchFile);
            let watchTransformedFile = this.managerForFile(path)?.watchTransformedFile ?? __classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f").watchFile;
            return watchTransformedFile(path, originalCallback, pollingInterval, options);
        };
        this.readTransformedFile = (filename, encoding) => {
            let readTransformedFile = this.managerForFile(filename)?.readTransformedFile ?? __classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f").readFile;
            return readTransformedFile(filename, encoding);
        };
        this.getModifiedTime = (filename) => {
            assert(__classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f").getModifiedTime);
            let getModifiedTime = this.managerForFile(filename)?.getModifiedTime ?? __classPrivateFieldGet(this, _TransformManagerPool_rootSys, "f").getModifiedTime;
            return getModifiedTime(filename);
        };
        __classPrivateFieldSet(this, _TransformManagerPool_rootTS, ts, "f");
        __classPrivateFieldSet(this, _TransformManagerPool_rootSys, ts.sys, "f");
    }
    get isPool() {
        return true;
    }
    managerForFile(path) {
        return this.managerForDirectory(dirname(path));
    }
    managerForDirectory(path) {
        let config = __classPrivateFieldGet(this, _TransformManagerPool_loader, "f").configForDirectory(path);
        if (!config)
            return null;
        const existing = __classPrivateFieldGet(this, _TransformManagerPool_managers, "f").get(config);
        if (existing)
            return existing;
        const manager = new TransformManager(config);
        __classPrivateFieldGet(this, _TransformManagerPool_managers, "f").set(config, manager);
        return manager;
    }
}
_TransformManagerPool_rootTS = new WeakMap(), _TransformManagerPool_rootSys = new WeakMap(), _TransformManagerPool_managers = new WeakMap(), _TransformManagerPool_loader = new WeakMap();
//# sourceMappingURL=transform-manager-pool.js.map