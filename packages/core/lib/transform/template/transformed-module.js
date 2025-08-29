import { assert } from '../util.js';
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
    constructor(transformedContents, errors, directives, correlatedSpans) {
        this.transformedContents = transformedContents;
        this.errors = errors;
        this.directives = directives;
        this.correlatedSpans = correlatedSpans;
    }
    toDebugString() {
        let mappingStrings = this.correlatedSpans.map((span) => span.mapping?.toDebugString({
            originalStart: span.originalStart,
            originalSource: span.originalFile.contents.slice(span.originalStart, span.originalStart + span.originalLength),
            transformedStart: span.transformedStart,
            transformedSource: span.transformedSource,
        }));
        return `TransformedModule\n\n${mappingStrings.filter(Boolean).join('\n\n')}`;
    }
    getOriginalOffset(transformedOffset) {
        let { start, source } = this.getOriginalRange(transformedOffset, transformedOffset);
        return { source, offset: start };
    }
    getTransformedOffset(originalFileName, originalOffset) {
        return this.getTransformedRange(originalFileName, originalOffset, originalOffset).start;
    }
    getOriginalRange(transformedStart, transformedEnd) {
        let startInfo = this.determineOriginalOffsetAndSpan(transformedStart);
        let endInfo = this.determineOriginalOffsetAndSpan(transformedEnd);
        assert(startInfo.correlatedSpan.originalFile === endInfo.correlatedSpan.originalFile, 'Attempted to transform a range across two different files');
        let source = startInfo.correlatedSpan.originalFile;
        let start = startInfo.originalOffset;
        let end = endInfo.originalOffset;
        if (startInfo.correlatedSpan === endInfo.correlatedSpan) {
            let { correlatedSpan } = startInfo;
            let mapping = correlatedSpan.mapping?.narrowestMappingForTransformedRange({
                start: start - correlatedSpan.originalStart,
                end: end - correlatedSpan.originalStart,
            });
            if (mapping) {
                let start = correlatedSpan.originalStart + mapping.originalRange.start;
                let end = correlatedSpan.originalStart + mapping.originalRange.end;
                return { mapping, start, end, source };
            }
        }
        return { start, end, source };
    }
    getTransformedRange(originalFileName, originalStart, originalEnd) {
        let startInfo = this.determineTransformedOffsetAndSpan(originalFileName, originalStart);
        let endInfo = this.determineTransformedOffsetAndSpan(originalFileName, originalEnd);
        let start = startInfo.transformedOffset;
        let end = endInfo.transformedOffset;
        if (startInfo.correlatedSpan && startInfo.correlatedSpan === endInfo.correlatedSpan) {
            let { correlatedSpan } = startInfo;
            let mapping = correlatedSpan.mapping?.narrowestMappingForOriginalRange({
                start: start - correlatedSpan.transformedStart,
                end: end - correlatedSpan.transformedStart,
            });
            if (mapping) {
                let start = correlatedSpan.transformedStart + mapping.transformedRange.start;
                let end = correlatedSpan.transformedStart + mapping.transformedRange.end;
                return { mapping, start, end };
            }
        }
        return { start, end };
    }
    findTemplateAtOriginalOffset(originalFileName, originalOffset) {
        let { correlatedSpan } = this.determineTransformedOffsetAndSpan(originalFileName, originalOffset);
        if (!correlatedSpan.mapping) {
            return null;
        }
        let templateMapping = correlatedSpan.mapping?.children[0];
        assert(correlatedSpan.mapping?.sourceNode.type === 'TemplateEmbedding' &&
            templateMapping?.sourceNode.type === 'Template', 'Internal error: unexpected mapping structure.' + ` (${templateMapping?.sourceNode.type})`);
        let originalContentStart = correlatedSpan.originalStart + templateMapping.originalRange.start;
        let originalContentEnd = correlatedSpan.originalStart + templateMapping.originalRange.end;
        let originalContent = correlatedSpan.originalFile.contents.slice(originalContentStart, originalContentEnd);
        return { originalContentStart, originalContentEnd, originalContent };
    }
    determineOriginalOffsetAndSpan(transformedOffset) {
        for (let span of this.correlatedSpans) {
            if (transformedOffset >= span.transformedStart &&
                transformedOffset <= span.transformedStart + span.transformedLength) {
                return {
                    originalOffset: transformedOffset - span.transformedStart + span.originalStart,
                    correlatedSpan: span,
                };
            }
        }
        assert(false, 'Internal error: offset out of bounds');
    }
    determineTransformedOffsetAndSpan(originalFileName, originalOffset) {
        for (let span of this.correlatedSpans) {
            if (span.originalFile.filename === originalFileName &&
                originalOffset >= span.originalStart &&
                originalOffset < span.originalStart + span.originalLength) {
                return {
                    transformedOffset: originalOffset - span.originalStart + span.transformedStart,
                    correlatedSpan: span,
                };
            }
        }
        assert(false, 'Internal error: offset out of bounds');
    }
}
//# sourceMappingURL=transformed-module.js.map