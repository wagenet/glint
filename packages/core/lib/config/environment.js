import * as path from 'node:path';
import { createRequire } from 'node:module';
import escapeStringRegexp from 'escape-string-regexp';
import SilentError from 'silent-error';
const require = createRequire(import.meta.url);
export const DEFAULT_EXTENSIONS = {
    '.hbs': { kind: 'template' },
    '.js': { kind: 'untyped-script' },
    '.ts': { kind: 'typed-script' },
};
export class GlintEnvironment {
    constructor(names, config) {
        this.names = names;
        this.tagConfig = config.tags ?? {};
        this.extensionsConfig = config.extensions ?? {};
        this.standaloneTemplateConfig = config.template;
        this.tagImportRegexp = this.buildTagImportRegexp();
        this.typedScriptExtensions = this.extensionsOfType('typed-script');
        this.untypedScriptExtensions = this.extensionsOfType('untyped-script');
        this.templateExtensions = this.extensionsOfType('template');
    }
    static load(specifier, { rootDir = process.cwd() } = {}) {
        let envs = normalizeEnvironmentSpecifier(specifier);
        let config = loadMergedEnvironmentConfig(envs, rootDir);
        return new GlintEnvironment(Object.keys(envs), config);
    }
    getSourceKind(fileName) {
        let extension = path.extname(fileName);
        return this.extensionsConfig[extension]?.kind ?? 'unknown';
    }
    isTypedScript(path) {
        return this.getSourceKind(path) === 'typed-script';
    }
    isUntypedScript(path) {
        return this.getSourceKind(path) === 'untyped-script';
    }
    isScript(path) {
        let kind = this.getSourceKind(path);
        return kind === 'typed-script' || kind === 'untyped-script';
    }
    isTemplate(path) {
        return this.getSourceKind(path) === 'template';
    }
    /**
     * Returns an array of custom file extensions that the active environment
     * is able to handle.
     */
    getConfiguredFileExtensions() {
        return Object.keys(this.extensionsConfig);
    }
    /**
     * Returns any custom configuration for the given file extension.
     */
    getConfigForExtension(extension) {
        return this.extensionsConfig[extension];
    }
    /**
     * Returns configuration information for standalone templates in this environment,
     * including the location of their backing types module and any special forms
     * they support.
     */
    getStandaloneTemplateConfig() {
        if (this.standaloneTemplateConfig) {
            let { typesModule, specialForms } = this.standaloneTemplateConfig;
            return { typesModule, specialForms };
        }
    }
    /**
     * Given the path of a script, returns an array of candidate paths where
     * a template corresponding to that script might be located.
     */
    getPossibleTemplatePaths(scriptPath) {
        return normalizePathCandidates(this.standaloneTemplateConfig?.getPossibleTemplatePaths(scriptPath) ?? []);
    }
    /**
     * Given the path of a template, returns an array of candidate paths where
     * a script corresponding to that script might be located.
     */
    getPossibleScriptPaths(templatePath) {
        return normalizePathCandidates(this.standaloneTemplateConfig?.getPossibleScriptPaths(templatePath) ?? []);
    }
    /**
     * Indicates whether the given module _may_ have embedded templates in it.
     *
     * Note that this method is intended to be a cheaper initial pass to avoid needlessly
     * parsing modules that definitely don't require rewriting. It therefore may produce
     * false positives, but should never give a false negative.
     */
    moduleMayHaveEmbeddedTemplates(modulePath, moduleContents) {
        let config = this.getConfigForExtension(path.extname(modulePath));
        return Boolean(config?.preprocess || config?.transform || this.tagImportRegexp.test(moduleContents));
    }
    /**
     * Returns an array of template tags that should be rewritten according to this
     * config object, along with an import specifier indicating where the template types
     * for each tag can be found.
     */
    getConfiguredTemplateTags() {
        return this.tagConfig;
    }
    buildTagImportRegexp() {
        let importSources = Object.keys(this.tagConfig);
        let regexpSource = importSources.map(escapeStringRegexp).join('|');
        return new RegExp(regexpSource);
    }
    extensionsOfType(kind) {
        return Object.keys(this.extensionsConfig).filter((key) => this.extensionsConfig[key].kind === kind);
    }
}
function normalizeEnvironmentSpecifier(specifier) {
    if (typeof specifier === 'string') {
        return { [specifier]: null };
    }
    else if (Array.isArray(specifier)) {
        return specifier.reduce((obj, name) => ({ ...obj, [name]: null }), {});
    }
    return specifier;
}
function loadMergedEnvironmentConfig(envs, rootDir) {
    let tags = {};
    let extensions = { ...DEFAULT_EXTENSIONS };
    let template;
    for (let [envName, envUserConfig] of Object.entries(envs)) {
        let envPath = locateEnvironment(envName, rootDir);
        let envModule = require(envPath);
        let envFunction = envModule?.default ?? envModule;
        if (typeof envFunction !== 'function') {
            throw new SilentError(`The specified environment '${envName}', which was loaded from ${envPath}, ` +
                `does not appear to be a Glint environment package.`);
        }
        let config = envFunction(envUserConfig ?? {});
        if (config.template) {
            if (template) {
                throw new SilentError('Multiple configured Glint environments attempted to define behavior for standalone template files.');
            }
            template = config.template;
        }
        if (config.tags) {
            for (let [importSource, specifiers] of Object.entries(config.tags)) {
                tags[importSource] ?? (tags[importSource] = {});
                for (let [importSpecifier, tagConfig] of Object.entries(specifiers)) {
                    if (importSpecifier in tags[importSource]) {
                        throw new SilentError('Multiple configured Glint environments attempted to define behavior for the tag `' +
                            importSpecifier +
                            "` in module '" +
                            importSource +
                            "'.");
                    }
                    tags[importSource][importSpecifier] = tagConfig;
                }
            }
        }
        if (config.extensions) {
            for (let [extension, extensionConfig] of Object.entries(config.extensions)) {
                if (extension in extensions) {
                    throw new SilentError('Multiple configured Glint environments attempted to define handling for the ' +
                        extension +
                        ' file extension.');
                }
                extensions[extension] = extensionConfig;
            }
        }
    }
    return { tags, extensions, template };
}
function locateEnvironment(name, basedir) {
    let require = createRequire(path.resolve(basedir, 'package.json'));
    for (let candidate of [
        // 1st-party package name shorthand
        `@glint/environment-${name}/glint-environment-definition`,
        // 3rd-party package name shorthand
        `glint-environment-${name}/glint-environment-definition`,
        // Full package name
        `${name}/glint-environment-definition`,
        // Literal file path
        name,
    ]) {
        try {
            return require.resolve(candidate);
        }
        catch (error) {
            if (error?.code !== 'MODULE_NOT_FOUND') {
                throw error;
            }
        }
    }
    throw new SilentError(`Unable to resolve environment '${name}' from ${basedir}`);
}
function normalizePathCandidates(candidates) {
    return candidates.map((candidate) => typeof candidate === 'string' ? { path: candidate, deferTo: [] } : candidate);
}
//# sourceMappingURL=environment.js.map