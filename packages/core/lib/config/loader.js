import { createRequire } from 'node:module';
import * as path from 'node:path';
import * as fs from 'node:fs';
import SilentError from 'silent-error';
import { GlintConfig } from './config.js';
/**
 * @private
 *
 * Only exported for testing purposes. Do not import.
 */
export const require = createRequire(import.meta.url);
/**
 * `ConfigLoader` provides an interface for finding the Glint config that
 * applies to a given file or directory, ensuring that only a single instance
 * of `GlintConfig` is ever created for a given `tsconfig.json` or
 * `jsconfig.json` source file.
 */
export class ConfigLoader {
    constructor() {
        this.configs = new Map();
    }
    configForFile(filePath) {
        return this.configForDirectory(path.dirname(filePath));
    }
    configForDirectory(directory) {
        let ts = findTypeScript(directory);
        if (!ts)
            return null;
        let configPath = findNearestConfigFile(ts, directory);
        if (!configPath)
            return null;
        let existing = this.configs.get(configPath);
        if (existing !== undefined)
            return existing;
        let configInput = loadConfigInput(ts, configPath);
        let config = configInput ? new GlintConfig(ts, configPath, configInput) : null;
        this.configs.set(configPath, config);
        return config;
    }
}
export function findTypeScript(fromDir) {
    let requireFrom = path.resolve(fromDir, 'package.json');
    return (tryResolve(() => createRequire(requireFrom)('typescript')) ??
        tryResolve(() => require('typescript')));
}
function tryResolve(load) {
    try {
        return load();
    }
    catch (error) {
        if (error?.code === 'MODULE_NOT_FOUND') {
            return null;
        }
        throw error;
    }
}
function loadConfigInput(ts, entryPath) {
    let fullGlintConfig = {};
    let currentPath = entryPath;
    while (currentPath) {
        let currentContents = ts.readConfigFile(currentPath, ts.sys.readFile).config;
        let currentGlintConfig = currentContents.glint ?? {};
        assert(currentPath === entryPath || !currentGlintConfig.transform, 'Glint `transform` options may not be specified in extended config.');
        fullGlintConfig = { ...currentGlintConfig, ...fullGlintConfig };
        if (currentContents.extends) {
            currentPath = path.resolve(path.dirname(currentPath), currentContents.extends);
            if (!fs.existsSync(currentPath)) {
                try {
                    currentPath = require.resolve(currentContents.extends);
                }
                catch (error) {
                    // control the exception, do nothing.
                }
            }
        }
        else {
            currentPath = undefined;
        }
    }
    return validateConfigInput(fullGlintConfig);
}
function findNearestConfigFile(ts, searchFrom) {
    // Assume that the longest path is the most relevant one in the case that
    // multiple config files exist at or above our current directory.
    let configCandidates = [
        ts.findConfigFile(searchFrom, ts.sys.fileExists, 'tsconfig.json'),
        ts.findConfigFile(searchFrom, ts.sys.fileExists, 'jsconfig.json'),
    ]
        .filter((path) => typeof path === 'string')
        .sort((a, b) => b.length - a.length);
    return configCandidates[0];
}
function validateConfigInput(input) {
    if (!input['environment'])
        return null;
    assert(Array.isArray(input['environment'])
        ? input['environment'].every((env) => typeof env === 'string')
        : typeof input['environment'] === 'string' ||
            (typeof input['environment'] === 'object' && input['environment']), 'Glint config must specify an `environment` that is a string, array of strings, or an object ' +
        'mapping environment names to their config.');
    assert(input['checkStandaloneTemplates'] === undefined ||
        typeof input['checkStandaloneTemplates'] === 'boolean', 'If defined, `checkStandaloneTemplates` must be a boolean');
    return input;
}
function assert(test, message) {
    if (!test) {
        throw new SilentError(`Glint config: ${message}`);
    }
}
//# sourceMappingURL=loader.js.map