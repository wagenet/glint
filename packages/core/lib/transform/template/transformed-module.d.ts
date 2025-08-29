import MappingTree from './mapping-tree.js';
export declare type Range = {
    start: number;
    end: number;
};
export declare type RangeWithMapping = Range & {
    mapping?: MappingTree;
};
export declare type RangeWithMappingAndSource = RangeWithMapping & {
    source: SourceFile;
};
export declare type CorrelatedSpan = {
    /** Where this span of content originated */
    originalFile: SourceFile;
    /** The offset where this content began in its original source */
    originalStart: number;
    /** The length of this span's content in its original source */
    originalLength: number;
    /** The location in the untransformed source where this span is spliced in */
    insertionPoint: number;
    /** The contents of this span in the transformed output */
    transformedSource: string;
    /** The offset in the transformed output of this span */
    transformedStart: number;
    /** The length of this span in the transformed output */
    transformedLength: number;
    /** A mapping of offsets within this span between its original and transformed versions */
    mapping?: MappingTree;
};
export declare type DirectiveKind = 'ignore' | 'expect-error';
export declare type Directive = {
    kind: DirectiveKind;
    source: SourceFile;
    location: Range;
    areaOfEffect: Range;
};
export declare type TransformError = {
    isContentTagError?: boolean;
    message: string;
    location: Range;
    source: SourceFile;
};
export declare type SourceFile = {
    filename: string;
    contents: string;
};
/**
 * This class represents the result of transforming a TypeScript
 * module with one or more embedded HBS templates. It contains
 * both the original and transformed source text of the module, as
 * well any errors encountered during transformation.
 *
 * It can be queried with an offset or range in either the
 * original or transformed source to determine the corresponding
 * offset or range in the other.
 */
export default class TransformedModule {
    readonly transformedContents: string;
    readonly errors: ReadonlyArray<TransformError>;
    readonly directives: ReadonlyArray<Directive>;
    private readonly correlatedSpans;
    constructor(transformedContents: string, errors: ReadonlyArray<TransformError>, directives: ReadonlyArray<Directive>, correlatedSpans: Array<CorrelatedSpan>);
    toDebugString(): string;
    getOriginalOffset(transformedOffset: number): {
        source?: SourceFile;
        offset: number;
    };
    getTransformedOffset(originalFileName: string, originalOffset: number): number;
    getOriginalRange(transformedStart: number, transformedEnd: number): RangeWithMappingAndSource;
    getTransformedRange(originalFileName: string, originalStart: number, originalEnd: number): RangeWithMapping;
    findTemplateAtOriginalOffset(originalFileName: string, originalOffset: number): {
        originalContentStart: number;
        originalContentEnd: number;
        originalContent: string;
    } | null;
    private determineOriginalOffsetAndSpan;
    private determineTransformedOffsetAndSpan;
}
