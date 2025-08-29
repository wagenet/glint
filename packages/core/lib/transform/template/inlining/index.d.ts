import type * as ts from 'typescript';
import { CorrelatedSpan, Directive, TransformError } from '../transformed-module.js';
import { TSLib } from '../../util.js';
export declare type PartialCorrelatedSpan = Omit<CorrelatedSpan, 'transformedStart' | 'transformedLength'>;
export declare type CorrelatedSpansResult = {
    errors: Array<TransformError>;
    directives: Array<Directive>;
    partialSpans: Array<PartialCorrelatedSpan>;
};
/**
 * Given an AST node for an embedded template, determines whether it's embedded
 * within a class in such a way that that class should be treated as its backing
 * value.
 */
export declare function isEmbeddedInClass(ts: TSLib, node: ts.Node): boolean;
