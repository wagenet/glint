import { preprocess } from '@glimmer/syntax';
import MappingTree, { TemplateEmbedding } from './mapping-tree.js';
import { assert } from '../util.js';
/**
 * @glimmer/syntax parses identifiers as strings. Aside from meaning
 * we often have to reverse engineer location information for them
 * by hand, it also means we can't treat mappings from identifiers
 * consistently with how we treat mappings from other AST nodes.
 *
 * This class just gives us a uniform way to store identifiers
 * or other nodes as the `source` for a mapping.
 */
export class Identifier {
    constructor(name) {
        this.name = name;
        this.type = 'Identifier';
    }
}
/**
 * Given the text of an embedded template, invokes the given callback
 * with a set of tools to emit mapped contents corresponding to
 * that template, tracking the text emitted in order to provide
 * a mapping of ranges in the input to ranges in the output.
 */
export function mapTemplateContents(template, { embeddingSyntax }, callback) {
    let ast = null;
    let errors = [];
    let lineOffsets = calculateLineOffsets(template, embeddingSyntax.prefix.length);
    try {
        ast = preprocess(template);
    }
    catch (error) {
        let message = getErrorMessage(error);
        let location;
        if (isHBSSyntaxError(error)) {
            location = {
                start: lineOffsets[error.hash.loc.first_line] + error.hash.loc.first_column,
                end: lineOffsets[error.hash.loc.last_line] + error.hash.loc.last_column,
            };
        }
        else {
            let match = /line (\d+) : column (\d+)/.exec(message);
            if (match) {
                let offset = lineOffsets[Number(match[1])] + Number(match[2]);
                location = { start: offset, end: offset };
            }
        }
        errors.push({ message, location });
    }
    let rangeForNode = buildRangeForNode(lineOffsets);
    let rangeForLine = (line) => ({
        start: lineOffsets[line],
        end: lineOffsets[line + 1] ?? template.length,
    });
    let segmentsStack = [[]];
    let mappingsStack = [[]];
    let indent = '';
    let offset = 0;
    let needsIndent = false;
    let directives = [];
    // Associates all content emitted during the given callback with the
    // given range in the template source and corresponding AST node.
    // If an exception is thrown while executing the callback, the error
    // will be captured and associated with the given range, and no content
    // will be emitted.
    let captureMapping = (hbsRange, source, allowEmpty, callback) => {
        let start = offset;
        let mappings = [];
        let segments = [];
        segmentsStack.unshift(segments);
        mappingsStack.unshift(mappings);
        try {
            callback();
        }
        catch (error) {
            errors.push({ message: getErrorMessage(error), location: hbsRange });
            offset = start;
        }
        mappingsStack.shift();
        segmentsStack.shift();
        // If the offset didn't change (either because nothing was emitted
        // or because an exception was thrown), don't add a new node to the
        // mapping tree or flush any new content.
        if (start !== offset || allowEmpty) {
            let end = offset;
            let tsRange = { start, end };
            mappingsStack[0].push(new MappingTree(tsRange, hbsRange, mappings, source));
            segmentsStack[0].push(...segments);
        }
    };
    let record = {
        error(message, location) {
            errors.push({ message, location });
        },
        directive(kind, location, areaOfEffect) {
            directives.push({ kind, location, areaOfEffect });
        },
    };
    let emit = {
        indent() {
            indent += '  ';
        },
        dedent() {
            indent = indent.slice(2);
        },
        newline() {
            offset += 1;
            segmentsStack[0].push('\n');
            needsIndent = true;
        },
        text(value) {
            if (needsIndent) {
                offset += indent.length;
                segmentsStack[0].push(indent);
                needsIndent = false;
            }
            offset += value.length;
            segmentsStack[0].push(value);
        },
        synthetic(value) {
            if (value.length) {
                emit.identifier(value, 0, 0);
            }
        },
        nothing(node, source = node) {
            captureMapping(rangeForNode(node), source, true, () => { });
        },
        identifier(value, hbsOffset, hbsLength = value.length) {
            // If there's a pending indent, flush that so it's not included in
            // the range mapping for the identifier we're about to emit
            if (needsIndent) {
                emit.text('');
            }
            let hbsRange = { start: hbsOffset, end: hbsOffset + hbsLength };
            let source = new Identifier(value);
            captureMapping(hbsRange, source, true, () => emit.text(value));
        },
        forNode(node, callback) {
            captureMapping(rangeForNode(node), node, false, callback);
        },
    };
    callback(ast, { emit, record, rangeForLine, rangeForNode });
    assert(segmentsStack.length === 1);
    let code = segmentsStack[0].join('');
    let mapping = new MappingTree({ start: 0, end: code.length }, {
        start: 0,
        end: embeddingSyntax.prefix.length + template.length + embeddingSyntax.suffix.length,
    }, mappingsStack[0], new TemplateEmbedding());
    return { errors, result: { code, directives, mapping } };
}
const LEADING_WHITESPACE = /^\s+/;
const TRAILING_WHITESPACE = /\s+$/;
function calculateLineOffsets(template, contentOffset) {
    let lines = template.split('\n');
    let total = contentOffset;
    let offsets = [contentOffset];
    for (let [index, line] of lines.entries()) {
        // lines from @glimmer/syntax are 1-indexed
        offsets[index + 1] = total;
        total += line.length + 1;
    }
    return offsets;
}
function buildRangeForNode(offsets) {
    return (node) => {
        let { loc } = node;
        let start = offsets[loc.start.line] + loc.start.column;
        let end = offsets[loc.end.line] + loc.end.column;
        // This makes error reporting for illegal text nodes (e.g. alongside named blocks)
        // a bit nicer by only highlighting the content rather than all the surrounding
        // newlines and attendant whitespace
        if (node.type === 'TextNode') {
            let leading = LEADING_WHITESPACE.exec(node.chars)?.[0].length ?? 0;
            let trailing = TRAILING_WHITESPACE.exec(node.chars)?.[0].length ?? 0;
            if (leading !== node.chars.length) {
                start += leading;
                end -= trailing;
            }
        }
        return { start, end };
    };
}
function getErrorMessage(error) {
    return error?.message ?? '(unknown error)';
}
function isHBSSyntaxError(error) {
    if (typeof error === 'object' && !!error && 'hash' in error) {
        let { hash } = error;
        return typeof hash?.loc === 'object';
    }
    return false;
}
//# sourceMappingURL=map-template-contents.js.map