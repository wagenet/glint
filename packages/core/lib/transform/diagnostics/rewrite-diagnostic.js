import { assert, createSyntheticSourceFile } from '../util.js';
import { augmentDiagnostic } from './augmentation.js';
/**
 * Given a TypeScript diagnostic object from a module that was rewritten
 * by `rewriteModule`, as well as the resulting `TransformedModule`, returns
 * a rewritten version of that diagnostic that maps to the corresponding
 * location in the original source file.
 */
export function rewriteDiagnostic(ts, transformedDiagnostic, locateTransformedModule) {
    assert(transformedDiagnostic.file);
    assert(transformedDiagnostic.start);
    assert(transformedDiagnostic.length);
    let transformedModule = locateTransformedModule(transformedDiagnostic.file.fileName);
    if (!transformedModule) {
        return transformedDiagnostic;
    }
    let { start, end, mapping, source } = transformedModule.getOriginalRange(transformedDiagnostic.start, transformedDiagnostic.start + transformedDiagnostic.length);
    let length = end - start;
    let diagnostic = {
        ...transformedDiagnostic,
        start,
        length,
        file: createSyntheticSourceFile(ts, source),
        relatedInformation: transformedDiagnostic.relatedInformation?.map((relatedInfo) => rewriteDiagnostic(ts, relatedInfo, locateTransformedModule)),
    };
    if (mapping) {
        diagnostic = augmentDiagnostic(diagnostic, mapping);
    }
    return diagnostic;
}
//# sourceMappingURL=rewrite-diagnostic.js.map