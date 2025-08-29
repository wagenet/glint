import type * as ts from 'typescript';
declare type TSLib = typeof ts;
export declare type GlintConfigInput = {
    environment: string | Array<string> | Record<string, unknown>;
    checkStandaloneTemplates?: boolean;
};
export declare type GlintEnvironmentConfig = {
    tags?: GlintTagsConfig;
    template?: GlintTemplateConfig;
    extensions?: GlintExtensionsConfig;
};
export declare type GlintExtensionPreprocess<T> = (source: string, filePath: string) => {
    contents: string;
    data?: T;
};
export declare type GlintEmitMetadata = {
    prepend?: string;
    append?: string;
    templateLocation?: {
        start: number;
        end: number;
        contentStart: number;
        contentEnd: number;
    };
};
export declare type GlintExtensionTransform<T> = (data: T, state: {
    ts: TSLib;
    context: ts.TransformationContext;
    setEmitMetadata: (node: ts.TaggedTemplateExpression, meta: GlintEmitMetadata) => void;
}) => ts.Transformer<ts.Node>;
export declare type GlintSpecialForm = 'if' | 'if-not' | 'yield' | 'object-literal' | 'array-literal' | 'bind-invokable' | '===' | '!==' | '&&' | '||' | '!';
export declare type GlintSpecialFormConfig = {
    globals?: {
        [global: string]: GlintSpecialForm;
    };
    imports?: {
        [path: string]: {
            [identifier: string]: GlintSpecialForm;
        };
    };
};
export declare type SourceKind = 'typed-script' | 'untyped-script' | 'template';
export declare type GlintExtensionConfig<PreprocessData = any> = {
    kind: SourceKind;
    preprocess?: GlintExtensionPreprocess<PreprocessData>;
    transform?: GlintExtensionTransform<PreprocessData>;
};
export declare type GlintExtensionsConfig = {
    [extension: string]: GlintExtensionConfig;
};
export declare type GlintTagConfig = {
    typesModule: string;
    globals?: Array<string>;
    specialForms?: GlintSpecialFormConfig;
};
export declare type GlintTagsConfig = {
    [importSource: string]: {
        [importSpecifier: string]: GlintTagConfig;
    };
};
export declare type PathCandidate = string | PathCandidateWithDeferral;
export declare type PathCandidateWithDeferral = {
    /** The path to be considered. */
    path: string;
    /** Other paths which, if present, should be preferred to this one. */
    deferTo: Array<string>;
};
export declare type GlintTemplateConfig = {
    typesModule: string;
    specialForms?: {
        [global: string]: GlintSpecialForm;
    };
    getPossibleTemplatePaths(scriptPath: string): Array<PathCandidate>;
    getPossibleScriptPaths(templatePath: string): Array<PathCandidate>;
};
export {};
