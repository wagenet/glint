/**
 * Adapted from https://github.com/microsoft/vscode/blob/5347c21ecfd26378e0153b6e2e212a8fbc28fa52/extensions/typescript-language-features/src/utils/previewer.ts
 */
import type * as ts from 'typescript';
export declare function getTagDocumentation(tag: ts.JSDocTagInfo): string | undefined;
export declare function plain(parts: ts.SymbolDisplayPart[] | string): string;
