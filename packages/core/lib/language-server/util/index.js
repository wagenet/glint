export { positionToOffset, offsetToPosition } from './position.js';
export { scriptElementKindToCompletionItemKind } from './protocol.js';
import { URI } from 'vscode-uri';
export function uriToFilePath(uri) {
    return URI.parse(uri).fsPath.replace(/\\/g, '/');
}
export function filePathToUri(filePath) {
    return URI.file(filePath).toString();
}
export function normalizeFilePath(filePath) {
    return uriToFilePath(filePathToUri(filePath));
}
//# sourceMappingURL=index.js.map