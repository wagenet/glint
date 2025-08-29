import { AST } from '@glimmer/syntax';
import MappingTree, { MappingSource } from './mapping-tree.js';
import { Directive, DirectiveKind, Range } from './transformed-module.js';
/**
 * @glimmer/syntax parses identifiers as strings. Aside from meaning
 * we often have to reverse engineer location information for them
 * by hand, it also means we can't treat mappings from identifiers
 * consistently with how we treat mappings from other AST nodes.
 *
 * This class just gives us a uniform way to store identifiers
 * or other nodes as the `source` for a mapping.
 */
export declare class Identifier {
    readonly name: string;
    readonly type = "Identifier";
    constructor(name: string);
}
export declare type Mapper = {
    /**
     * Given a @glimmer/syntax AST node, returns the corresponding start
     * and end offsets of that node in the original source.
     */
    rangeForNode: (node: AST.Node) => Range;
    /**
     * Given a 0-based line number, returns the corresponding start and
     * end offsets for that line.
     */
    rangeForLine: (line: number) => Range;
    record: {
        /**
         * Captures the existence of a directive specified by the given source
         * node and affecting the given range of text.
         */
        directive: (type: DirectiveKind, location: Range, areaOfEffect: Range) => void;
        /**
         * Records an error at the given location.
         */
        error: (message: string, location: Range) => void;
    };
    emit: {
        /** Emit a newline in the transformed source */
        newline(): void;
        /** Increase the indent level for future emitted content */
        indent(): void;
        /** Decrease the indent level for future emitted content */
        dedent(): void;
        /** Append the given raw text to the transformed source */
        text(value: string): void;
        /**
         * Append the given raw text to the transformed source, creating
         * a 0-length mapping for it in the output.
         */
        synthetic(value: string): void;
        /**
         * Essentially the inverse of `emit.synthetic`, this notes the
         * presence of a template AST node at a given location while not
         * emitting anything in the resulting TS translation.
         */
        nothing(node: AST.Node, source?: MappingSource): void;
        /**
         * Append the given value to the transformed source, mapping
         * that span back to the given offset in the original source.
         */
        identifier(value: string, hbsOffset: number, hbsLength?: number): void;
        /**
         * Map all content emitted in the given callback to the span
         * corresponding to the given AST node in the original source.
         */
        forNode(node: AST.Node, callback: () => void): void;
    };
};
declare type LocalDirective = Omit<Directive, 'source'>;
/** The result of rewriting a template */
export declare type RewriteResult = {
    /**
     * Any errors discovered during rewriting, along with their location
     * in terms of the original source.
     */
    errors: Array<{
        message: string;
        location: Range | undefined;
    }>;
    /**
     * The source code and a `MappingTree` resulting from rewriting a
     * template. If the template contains unrecoverable syntax errors,
     * this may be undefined.
     */
    result?: {
        code: string;
        directives: Array<LocalDirective>;
        mapping: MappingTree;
    };
};
/**
 * Syntax surrounding the contents of a template that marks it as
 * embedded within the surrounding context, like the `hbs` tag and
 * backticks on a tagged string or the `<template>` markers in a
 * `.gts`/`.gjs` file.
 */
export declare type EmbeddingSyntax = {
    prefix: string;
    suffix: string;
};
export declare type MapTemplateContentsOptions = {
    embeddingSyntax: EmbeddingSyntax;
};
/**
 * Given the text of an embedded template, invokes the given callback
 * with a set of tools to emit mapped contents corresponding to
 * that template, tracking the text emitted in order to provide
 * a mapping of ranges in the input to ranges in the output.
 */
export declare function mapTemplateContents(template: string, { embeddingSyntax }: MapTemplateContentsOptions, callback: (ast: AST.Template | null, mapper: Mapper) => void): RewriteResult;
export {};
