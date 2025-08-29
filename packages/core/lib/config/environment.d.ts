import { GlintEnvironmentConfig, GlintExtensionConfig, GlintExtensionsConfig, GlintTagsConfig, GlintTemplateConfig, PathCandidateWithDeferral, SourceKind } from '@glint/core/config-types';
export declare const DEFAULT_EXTENSIONS: GlintExtensionsConfig;
export declare class GlintEnvironment {
    readonly names: Array<string>;
    private tagConfig;
    private extensionsConfig;
    private standaloneTemplateConfig;
    private tagImportRegexp;
    typedScriptExtensions: ReadonlyArray<string>;
    untypedScriptExtensions: ReadonlyArray<string>;
    templateExtensions: ReadonlyArray<string>;
    constructor(names: Array<string>, config: GlintEnvironmentConfig);
    static load(specifier: string | Array<string> | Record<string, unknown>, { rootDir }?: {
        rootDir?: string | undefined;
    }): GlintEnvironment;
    getSourceKind(fileName: string): SourceKind | 'unknown';
    isTypedScript(path: string): boolean;
    isUntypedScript(path: string): boolean;
    isScript(path: string): boolean;
    isTemplate(path: string): boolean;
    /**
     * Returns an array of custom file extensions that the active environment
     * is able to handle.
     */
    getConfiguredFileExtensions(): Array<string>;
    /**
     * Returns any custom configuration for the given file extension.
     */
    getConfigForExtension(extension: string): GlintExtensionConfig | undefined;
    /**
     * Returns configuration information for standalone templates in this environment,
     * including the location of their backing types module and any special forms
     * they support.
     */
    getStandaloneTemplateConfig(): Pick<GlintTemplateConfig, 'typesModule' | 'specialForms'> | undefined;
    /**
     * Given the path of a script, returns an array of candidate paths where
     * a template corresponding to that script might be located.
     */
    getPossibleTemplatePaths(scriptPath: string): Array<PathCandidateWithDeferral>;
    /**
     * Given the path of a template, returns an array of candidate paths where
     * a script corresponding to that script might be located.
     */
    getPossibleScriptPaths(templatePath: string): Array<PathCandidateWithDeferral>;
    /**
     * Indicates whether the given module _may_ have embedded templates in it.
     *
     * Note that this method is intended to be a cheaper initial pass to avoid needlessly
     * parsing modules that definitely don't require rewriting. It therefore may produce
     * false positives, but should never give a false negative.
     */
    moduleMayHaveEmbeddedTemplates(modulePath: string, moduleContents: string): boolean;
    /**
     * Returns an array of template tags that should be rewritten according to this
     * config object, along with an import specifier indicating where the template types
     * for each tag can be found.
     */
    getConfiguredTemplateTags(): GlintTagsConfig;
    private buildTagImportRegexp;
    private extensionsOfType;
}
