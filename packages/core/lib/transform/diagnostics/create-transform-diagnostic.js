import { createSyntheticSourceFile } from '../util.js';
export function createTransformDiagnostic(ts, source, message, location, isContentTagError = false) {
    return {
        isContentTagError,
        isGlintTransformDiagnostic: true,
        category: ts.DiagnosticCategory.Error,
        code: 0,
        file: createSyntheticSourceFile(ts, source),
        start: location.start,
        length: location.end - location.start,
        messageText: message,
    };
}
//# sourceMappingURL=create-transform-diagnostic.js.map